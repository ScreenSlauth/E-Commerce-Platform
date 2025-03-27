import Image from "next/image"

export function PaymentMethods() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <div className="bg-white px-4 py-2 rounded border flex items-center gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
          alt="Visa"
          width={32}
          height={20}
          className="h-5 w-auto"
        />
        <span>Visa</span>
      </div>
      <div className="bg-white px-4 py-2 rounded border flex items-center gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
          alt="Mastercard"
          width={32}
          height={20}
          className="h-5 w-auto"
        />
        <span>Mastercard</span>
      </div>
      <div className="bg-white px-4 py-2 rounded border flex items-center gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
          alt="American Express"
          width={32}
          height={20}
          className="h-5 w-auto"
        />
        <span>American Express</span>
      </div>
      <div className="bg-white px-4 py-2 rounded border flex items-center gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/196/196565.png"
          alt="PayPal"
          width={32}
          height={20}
          className="h-5 w-auto"
        />
        <span>PayPal</span>
      </div>
      <div className="bg-white px-4 py-2 rounded border flex items-center gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/5968/5968249.png"
          alt="Apple Pay"
          width={32}
          height={20}
          className="h-5 w-auto"
        />
        <span>Apple Pay</span>
      </div>
      <div className="bg-white px-4 py-2 rounded border flex items-center gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/6124/6124998.png"
          alt="Google Pay"
          width={32}
          height={20}
          className="h-5 w-auto"
        />
        <span>Google Pay</span>
      </div>
    </div>
  )
}

