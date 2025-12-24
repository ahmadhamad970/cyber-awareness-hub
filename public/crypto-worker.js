// crypto-worker.js
// This worker only generates RSA + ECC keypairs and sends them back to the main thread.

importScripts("https://cdnjs.cloudflare.com/ajax/libs/node-forge/1.3.1/forge.min.js");

self.onmessage = (e) => {
  const { action } = e.data;

  if (action === "generate_keys") {
    try {
      // RSA keypair (2048 bits)
      const rsa = forge.pki.rsa.generateKeyPair({
        bits: 2048,
        workers: -1   // let forge use its own internal workers
      });

      // ECC keypair using secp256r1
      const ec = forge.pki.ec.generateKeyPair({
        namedCurve: "secp256r1"
      });

      self.postMessage({
        ok: true,
        rsaPublic: forge.pki.publicKeyToPem(rsa.publicKey),
        rsaPrivate: forge.pki.privateKeyToPem(rsa.privateKey),
        ecPublic: forge.pki.publicKeyToPem(ec.publicKey),
        ecPrivate: forge.pki.privateKeyToPem(ec.privateKey)
      });

    } catch (err) {
      self.postMessage({
        ok: false,
        error: err.toString()
      });
    }
  }
};
