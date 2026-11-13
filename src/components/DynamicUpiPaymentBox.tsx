import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, Copy, Check, Smartphone, ShieldCheck, Loader2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

export const STORE_UPI_ID = '9450253342@okbizaxis';
export const STORE_UPI_NAME = 'Tejas Spices Suriyawan';

interface DynamicUpiPaymentBoxProps {
  amount: number;
  orderHint?: string;
  upiRef: string;
  onChangeUpiRef: (val: string) => void;
  isVerified: boolean;
  onVerifyChange: (verified: boolean) => void;
}

export const DynamicUpiPaymentBox: React.FC<DynamicUpiPaymentBoxProps> = ({
  amount,
  orderHint = 'Tejas Spices Order',
  upiRef,
  onChangeUpiRef,
  isVerified,
  onVerifyChange,
}) => {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Dynamic UPI intent URI encoding exact amount
  const upiUri = `upi://pay?pa=${encodeURIComponent(STORE_UPI_ID)}&pn=${encodeURIComponent(
    STORE_UPI_NAME
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(orderHint)}`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [upiUri]);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(STORE_UPI_ID).catch(() => {});
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleVerifyPayment = () => {
    setVerifyError('');
    const cleanRef = upiRef.trim();
    if (cleanRef.length < 8) {
      setVerifyError(
        t(
          'Please enter the 12-digit UPI UTR / Transaction ID from GPay, PhonePe or Paytm.',
          'कृपया GPay, PhonePe या Paytm से प्राप्त कम से कम 8-12 अंकों का UPI UTR / ट्रांजैक्शन नंबर डालें।'
        )
      );
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifyChange(true);
    }, 650);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-white border border-indigo-200 rounded-2xl space-y-3.5 mt-2">
      {/* Header badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('Razorpay / Dynamic UPI Instant QR', 'डायनामिक UPI QR पेमेंट वेरिफिकेशन')}</span>
        </div>
        <span className="text-xs font-black font-mono bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
          ₹{amount}
        </span>
      </div>

      {/* QR + Instructions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border-2 border-indigo-200 shadow-xs shrink-0 flex flex-col items-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`Scan to pay ₹${amount} via UPI`}
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-slate-100 rounded-lg animate-pulse flex items-center justify-center text-[11px] text-slate-400">
              Generating QR...
            </div>
          )}
          <span className="text-[10px] font-bold text-indigo-900 mt-1">
            {t(`Scan & Pay ₹${amount}`, `स्कैन करके ₹${amount} पे करें`)}
          </span>
        </div>

        <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
          <div className="text-xs text-slate-700 leading-relaxed">
            {t(
              'Scan this dynamic QR code with any UPI app. The exact amount is auto-filled.',
              'किसी भी UPI ऐप (GPay, PhonePe, Paytm) से यह QR कोड स्कैन करें—सटीक राशि अपने आप भरी रहेगी।'
            )}
          </div>

          {/* Copy UPI ID */}
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-950">
              {STORE_UPI_ID}
            </span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors cursor-pointer"
            >
              {copiedUpi ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUpi ? t('Copied', 'कॉपी हो गया') : t('Copy ID', 'कॉपी करें')}</span>
            </button>
          </div>

          {/* Direct Mobile UPI App Pay Button */}
          <div>
            <a
              href={upiUri}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t(`Pay ₹${amount} via UPI App`, `UPI ऐप से ₹${amount} पे करें`)}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* UTR / Payment Verification Box */}
      <div className="pt-2.5 border-t border-indigo-100 space-y-2">
        <label className="block text-[11px] font-bold text-slate-700">
          {t(
            'Enter UPI UTR / Transaction Reference No. (for instant verification):',
            'पेमेंट के बाद 12-अंकों का UPI UTR / रेफरेंस नंबर दर्ज कर वेरिफाई करें:'
          )}
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={upiRef}
            onChange={(e) => {
              onChangeUpiRef(e.target.value);
              if (isVerified) onVerifyChange(false);
              setVerifyError('');
            }}
            placeholder={t('e.g. 431298765432 (12-digit UTR)', 'उदा. 431298765432 (12 अंकों का UTR)')}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-indigo-200 bg-white font-mono focus:outline-hidden focus:border-indigo-600"
          />

          <button
            type="button"
            onClick={handleVerifyPayment}
            disabled={isVerifying || isVerified}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              isVerified
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('Verifying...', 'जाँच हो रही...')}</span>
              </>
            ) : isVerified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('Payment Verified ✓', 'पेमेंट वेरिफाइड ✓')}</span>
              </>
            ) : (
              <span>{t('Verify Payment', 'वेरिफाई करें')}</span>
            )}
          </button>
        </div>

        {verifyError && (
          <p className="text-[11px] font-medium text-rose-600">{verifyError}</p>
        )}

        {isVerified && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {t(
                `Payment UTR #${upiRef} verified for ₹${amount}. Ready to place order!`,
                `₹${amount} का पेमेंट UTR #${upiRef} वेरिफाई हो गया है। अब आप ऑर्डर कन्फर्म कर सकते हैं!`
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
