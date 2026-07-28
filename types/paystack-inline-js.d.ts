// Ambient type declarations for @paystack/inline-js.
// The published package ships no .d.ts, so this describes the small slice of the
// PaystackPop v2 inline API that this app actually uses.
declare module '@paystack/inline-js' {
  export interface PaystackNewTransactionOptions {
    /** Paystack PUBLIC key (pk_...). */
    key: string;
    email: string;
    /** Amount in the smallest currency unit (kobo for NGN). */
    amount: number;
    currency?: string;
    reference?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    onSuccess?: (transaction: { id: number; reference: string; message: string }) => void;
    onCancel?: () => void;
    onError?: (error: { message: string }) => void;
    onLoad?: (response: { id: number; customer: unknown; accessCode: string }) => void;
  }

  export interface PaystackTransaction {
    reference?: string;
    id?: number;
  }

  export default class PaystackPop {
    static isLoaded(): boolean;
    newTransaction(options: PaystackNewTransactionOptions): PaystackTransaction;
    resumeTransaction(accessCode: string, callbacks?: Record<string, unknown>): PaystackTransaction;
    cancelTransaction(idOrTransaction: number | PaystackTransaction): void;
  }
}
