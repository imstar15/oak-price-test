export const sendExtrinsic = async (api, extrinsic, keyPair, { isSudo = false } = {}) => new Promise((resolve) => {
	const newExtrinsic = isSudo ? api.tx.sudo.sudo(extrinsic) : extrinsic;
	newExtrinsic.signAndSend(keyPair, { nonce: -1 }, ({ status, events }) => {
			console.log('status.type', status.type);

			if (status.isInBlock || status.isFinalized) {
					events
					// find/filter for failed events
							.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
					// we know that data for system.ExtrinsicFailed is
					// (DispatchError, DispatchInfo)
							.forEach(({ event: { data: [error] } }) => {
									if (error.isModule) {
											// for module errors, we have the section indexed, lookup
											const decoded = api.registry.findMetaError(error.asModule);
											const { docs, method, section } = decoded;
											console.log(`${section}.${method}: ${docs.join(' ')}`);
									} else {
											// Other, CannotLookup, BadOrigin, no extra info
											console.log(error.toString());
									}
							});

					if (status.isFinalized) {
							resolve({ events, blockHash: status.asFinalized.toString() });
					}
			}
	});
});
