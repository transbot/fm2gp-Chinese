import { useState } from 'react';
import { Home, Languages, Lock, Unlock, Key, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { DeveloperNote } from './DeveloperNote';
import { useLanguage } from '../context/LanguageContext';
import { ExplanationPanel } from './common/ExplanationPanel';
import { ValidationMessage } from './common/ValidationMessage';

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
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // Helper functions for RSA operations
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
    setValidationErrorKey(null);
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
    if (!keyPair) {
      return;
    }

    if (!message.trim()) {
      setValidationErrorKey('rsaMessageRequired');
      return;
    }

    setValidationErrorKey(null);

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
    <div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="min-w-0 max-w-[18rem] break-words text-2xl font-bold sm:max-w-none sm:text-3xl">{t.rsaTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="touch-target flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
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
                onChange={(e) => {
                  setMessage(e.target.value);
                  setValidationErrorKey(null);
                }}
                className="w-full px-4 py-2 border rounded-lg h-24"
                placeholder={t.enterMessage}
              />
              <div className="flex gap-4">
                <button
                  onClick={encrypt}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  {t.encrypt}
                </button>
              </div>
              <ValidationMessage errorKey={validationErrorKey} messages={t} />
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

      {/* Explanation Panel with RSA Invariants */}
      <ExplanationPanel
        stepDescription={
          keyPair
            ? encryptedMessage.length > 0
              ? decryptedMessage
                ? lang === 'en'
                  ? `Decrypted ${steps.length} bytes using private key d = ${keyPair.d.toString().slice(0, 10)}...`
                  : `使用私钥 d = ${keyPair.d.toString().slice(0, 10)}... 解密了 ${steps.length} 个字节`
                : lang === 'en'
                  ? `Encrypted ${steps.length} bytes using public key e = ${keyPair.e.toString()}`
                  : `使用公钥 e = ${keyPair.e.toString()} 加密了 ${steps.length} 个字节`
              : lang === 'en'
                ? `Keys generated: n = p × q = ${keyPair.n.toString()}`
                : `密钥已生成：n = p × q = ${keyPair.n.toString()}`
            : lang === 'en'
              ? 'Click Generate Keys to create an RSA key pair.'
              : '点击生成密钥创建 RSA 密钥对。'
        }
        invariant={
          lang === 'en'
            ? 'm^(e×d) ≡ m (mod n)  —  Encryption and decryption are inverse operations.'
            : 'm^(e×d) ≡ m (mod n)  —  加密和解密是逆运算。'
        }
        complexity={{
          time: 'O(log e × log² n)',
          space: 'O(log n)',
          worstCase: lang === 'en' ? 'Modular exponentiation dominates' : '模幂运算占主导',
        }}
        operationType={
          keyPair
            ? decryptedMessage
              ? lang === 'en'
                ? 'decryption'
                : '解密'
              : encryptedMessage.length > 0
                ? lang === 'en'
                  ? 'encryption'
                  : '加密'
                : lang === 'en'
                  ? 'key generation'
                  : '密钥生成'
            : undefined
        }
      />

      <DeveloperNote noteKey="devNoteRsa" />
      <Links lang={lang} />
    </div>
  );
}
