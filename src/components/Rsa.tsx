import React, { useState } from 'react';
import { Home, Languages, Lock, Unlock, Key, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface KeyPair {
  p: bigint;
  q: bigint;
  n: bigint;
  e: bigint;
  d: bigint;
}

interface EncryptionStep {
  byte: number;
  encrypted: bigint;
  decrypted?: number;
}

export function Rsa() {
  const [message, setMessage] = useState('');
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<bigint[]>([]);
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState<EncryptionStep[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // Helper functions for RSA operations
  const isPrime = (n: bigint): boolean => {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;

    for (let i = 5n; i * i <= n; i += 6n) {
      if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
  };

  const gcd = (a: bigint, b: bigint): bigint => {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const modInverse = (e: bigint, phi: bigint): bigint => {
    let m0 = phi;
    let y = 0n;
    let x = 1n;

    if (phi === 1n) return 0n;

    while (e > 1n) {
      const q = e / m0;
      let t = m0;

      m0 = e % m0;
      e = t;
      t = y;

      y = x - q * y;
      x = t;
    }

    if (x < 0n) x += phi;

    return x;
  };

  const generateKeyPair = () => {
    // Use relatively small primes for demonstration
    const primes = [
      61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n,
      101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n
    ];

    // Randomly select two different primes
    const p = primes[Math.floor(Math.random() * primes.length)];
    let q;
    do {
      q = primes[Math.floor(Math.random() * primes.length)];
    } while (q === p);

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    // Common choice for e
    let e = 65537n;
    while (gcd(e, phi) !== 1n) {
      e += 2n;
    }

    const d = modInverse(e, phi);

    setKeyPair({ p, q, n, e, d });
    setShowSteps(true);
    setEncryptedMessage([]);
    setDecryptedMessage('');
    setSteps([]);
  };

  const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
    if (modulus === 1n) return 0n;
    
    let result = 1n;
    base = base % modulus;
    
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      base = (base * base) % modulus;
      exponent = exponent >> 1n;
    }
    
    return result;
  };

  const stringToBytes = (str: string): number[] => {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(str));
  };

  const bytesToString = (bytes: number[]): string => {
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
  };

  const encrypt = () => {
    if (!keyPair || !message) return;

    // Convert string to UTF-8 bytes
    const bytes = stringToBytes(message);
    
    // Encrypt each byte and track steps
    const newSteps: EncryptionStep[] = [];
    const encrypted = bytes.map(byte => {
      const m = BigInt(byte);
      const c = modPow(m, keyPair.e, keyPair.n);
      newSteps.push({ byte, encrypted: c });
      return c;
    });

    setSteps(newSteps);
    setEncryptedMessage(encrypted);
    setDecryptedMessage('');
  };

  const decrypt = () => {
    if (!keyPair || encryptedMessage.length === 0) return;

    // Decrypt each number and update steps
    const updatedSteps = steps.map((step, index) => {
      const decrypted = Number(modPow(encryptedMessage[index], keyPair.d, keyPair.n));
      return { ...step, decrypted };
    });

    const decryptedBytes = updatedSteps.map(step => step.decrypted!);
    setSteps(updatedSteps);
    setDecryptedMessage(bytesToString(decryptedBytes));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-3xl font-bold">{t.rsaTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.rsaDescription}</p>

      <div className="space-y-6">
        <div className="flex gap-4">
          <button
            onClick={generateKeyPair}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Key className="w-4 h-4" />
            {t.generateKeys}
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                {t.rsaHideSteps}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                {t.rsaShowSteps}
              </>
            )}
          </button>
        </div>

        {keyPair && showSteps && (
          <div className="space-y-6">
            {showDetails && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-xl font-bold">{t.rsaSteps}</h2>
                
                <div className="space-y-6">
                  {/* Step 1: Key Generation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t.rsaStep1}</h3>
                    <p className="text-gray-600">{t.rsaStep1Explanation}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">{t.rsaPrimes}</h4>
                        <div className="font-mono">
                          p = {keyPair.p.toString()}<br />
                          q = {keyPair.q.toString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">{t.rsaTotient}</h4>
                        <div className="font-mono">
                          φ(n) = {((keyPair.p - 1n) * (keyPair.q - 1n)).toString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Encryption */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t.rsaStep2}</h3>
                    <p className="text-gray-600">{t.rsaStep2Explanation}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{t.rsaEncryptionFormula}</h4>
                      <p className="text-gray-600 mb-2">{t.rsaFormulaExplanation}</p>
                      <div className="font-mono">{t.rsaEncryptionFormulaDetail}</div>
                    </div>
                  </div>

                  {/* Step 3: Decryption */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t.rsaStep3}</h3>
                    <p className="text-gray-600">{t.rsaStep3Explanation}</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{t.rsaDecryptionFormula}</h4>
                      <p className="text-gray-600 mb-2">{t.rsaFormulaExplanation}</p>
                      <div className="font-mono">{t.rsaDecryptionFormulaDetail}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-bold">{t.keyDetails}</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{t.publicKey}</h3>
                  <div className="font-mono text-lg break-all">
                    ({keyPair.e.toString()}, {keyPair.n.toString()})
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t.publicKeyFormat}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{t.privateKey}</h3>
                  <div className="font-mono text-lg break-all">
                    ({keyPair.d.toString()}, {keyPair.n.toString()})
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t.privateKeyFormat}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">{t.rsaKeysNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {keyPair && (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t.messageToEncrypt}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg h-24"
                placeholder={t.enterMessage}
              />
              <div className="flex gap-4">
                <button
                  onClick={encrypt}
                  disabled={!message}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {t.encrypt}
                </button>
              </div>
            </div>

            {steps.length > 0 && showDetails && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h3 className="font-bold">{t.rsaDataFlow}</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded min-w-[80px] text-center">
                        <div className="text-xs text-gray-500">{t.rsaOriginalBytes}</div>
                        <div className="font-mono">{step.byte}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="bg-blue-50 p-2 rounded flex-1">
                        <div className="text-xs text-gray-500">{t.rsaEncryptedValues}</div>
                        <div className="font-mono break-all">{step.encrypted.toString()}</div>
                      </div>
                      {step.decrypted !== undefined && (
                        <>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div className="bg-green-50 p-2 rounded min-w-[80px] text-center">
                            <div className="text-xs text-gray-500">{t.rsaDecryptedBytes}</div>
                            <div className="font-mono">{step.decrypted}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {encryptedMessage.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold">{t.encryptedMessage}</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    {encryptedMessage.join(', ')}
                  </pre>
                </div>
                <button
                  onClick={decrypt}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Unlock className="w-4 h-4" />
                  {t.decrypt}
                </button>
              </div>
            )}

            {decryptedMessage && (
              <div className="space-y-2">
                <h3 className="font-bold">{t.decryptedMessage}</h3>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="font-mono">{decryptedMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Links lang={lang} />
    </div>
  );
}