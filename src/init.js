import { ApiPromise, WsProvider } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { sendExtrinsic } from './util';

const main = async () => {
	const wsProvider = new WsProvider('ws://127.0.0.1:9946');
	const api = await ApiPromise.create({ provider: wsProvider });

	const keyring = new Keyring({ type: 'sr25519' });
	const keyringPair = keyring.addFromUri('//Alice', undefined, 'sr25519');
	keyringPair.meta.name = 'Alice';

	const extrinsic = api.tx.automationPrice.initializeAsset('shibuya', 'arthswap', 'WRSTR', 'USDT', '18', [keyringPair.addressRaw]);
	// await sendExtrinsic(api, extrinsic, keyringPair, { isSudo: true });
	await sendExtrinsic(api, extrinsic, keyringPair);
}

main().catch(console.error).finally(() => {
	console.log('Reached the end of main() ...');
	process.exit();
});
