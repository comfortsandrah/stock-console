import { Product } from "@/types/product"

export const initialProducts: Product[] = [
  {
    id: 1,
    title: "Paracetamol 500mg Tablets",
    description: "High-grade Paracetamol 500mg tablets for effective relief of mild to moderate pain including headache, migraine, toothache, and fever reduction in adult and pediatric clinical settings.",
    category: "medicines",
    price: 3.5,
    discountPercentage: 5.2,
    rating: 4.8,
    stock: 240,
    tags: ["analgesic", "antipyretic", "essential", "tablets", "otc"],
    brand: "PharmaCare Labs",
    sku: "MED-PARA-500",
    weight: 0.25,
    dimensions: {
      width: 8.5,
      height: 4.2,
      depth: 2.1,
    },
    warrantyInformation: "24 months shelf life from manufacturing date",
    shippingInformation: "Ships in temperature-controlled medical packing within 24 hours",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Consistently reliable stock for the primary care clinic. Well packaged blister packs.",
        date: "2026-09-08T10:15:00Z",
        reviewerName: "Dr. Sarah Jenkins",
        reviewerEmail: "s.jenkins@cityclinic.org",
      },
      {
        rating: 4.5,
        comment: "Standard stock item, quick delivery and long expiry dates.",
        date: "2026-08-22T14:30:00Z",
        reviewerName: "Nurse Ethan Cole",
        reviewerEmail: "e.cole@generalward.med",
      },
      {
        rating: 5,
        comment: "Essential ward supply. High inventory turnover with zero packaging defects.",
        date: "2026-08-10T09:00:00Z",
        reviewerName: "Pharm. Michael Chen",
        reviewerEmail: "m.chen@centralrx.com",
      },
    ],
    returnPolicy: "30-day unopened batch return policy with lot verification",
    minimumOrderQuantity: 10,
    meta: {
      createdAt: "2025-01-15T08:00:00Z",
      updatedAt: "2026-09-10T08:30:00Z",
      barcode: "8901234567890",
      qrCode: "https://placehold.co/150x150?text=QR-PARA-500",
    },
    thumbnail: "https://placehold.co/400x400?text=Paracetamol+500mg",
    images: [
      "https://placehold.co/600x600?text=Paracetamol+Pack",
      "https://placehold.co/600x600?text=Blister+Pack",
      "https://placehold.co/600x600?text=Tablet+Detail",
    ],
  },
  {
    id: 2,
    title: "Amoxicillin 500mg Capsules",
    description: "Broad-spectrum beta-lactam antibiotic used in the clinical management of bacterial infections of the respiratory tract, urinary tract, and skin.",
    category: "medicines",
    price: 8.75,
    discountPercentage: 8.0,
    rating: 4.7,
    stock: 85,
    tags: ["antibiotic", "prescription", "capsules", "respiratory"],
    brand: "BioMedix Pharmaceuticals",
    sku: "MED-AMOX-500",
    weight: 0.18,
    dimensions: {
      width: 9.0,
      height: 5.0,
      depth: 2.5,
    },
    warrantyInformation: "36 months shelf life when stored below 25°C",
    shippingInformation: "Express courier with dry environment guarantee",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Excellent formulation and clearly labeled batch codes. Very fast dispensing.",
        date: "2026-09-05T11:20:00Z",
        reviewerName: "Dr. Amanda Ross",
        reviewerEmail: "amanda.ross@metrohealth.org",
      },
      {
        rating: 4,
        comment: "Standard 21-capsule course packaging. Recommended.",
        date: "2026-08-18T16:45:00Z",
        reviewerName: "Robert Taylor RN",
        reviewerEmail: "r.taylor@ward4.org",
      },
    ],
    returnPolicy: "Strictly controlled return policy for prescription antibiotics",
    minimumOrderQuantity: 5,
    meta: {
      createdAt: "2025-02-10T09:00:00Z",
      updatedAt: "2026-09-09T14:20:00Z",
      barcode: "8901234567891",
      qrCode: "https://placehold.co/150x150?text=QR-AMOX-500",
    },
    thumbnail: "https://placehold.co/400x400?text=Amoxicillin+500mg",
    images: [
      "https://placehold.co/600x600?text=Amoxicillin+Box",
      "https://placehold.co/600x600?text=Capsules+CloseUp",
    ],
  },
  {
    id: 3,
    title: "Disposable Examination Gloves",
    description: "Medical-grade powder-free nitrile examination gloves. Textured fingertips for enhanced tactile sensitivity and superior barrier protection against biological fluids and chemicals.",
    category: "supplies",
    price: 12.99,
    discountPercentage: 12.5,
    rating: 4.6,
    stock: 12,
    tags: ["nitrile", "gloves", "ppe", "examination", "latex-free"],
    brand: "SafeGrip Healthcare",
    sku: "SUP-GLV-100",
    weight: 0.65,
    dimensions: {
      width: 22.0,
      height: 12.0,
      depth: 6.5,
    },
    warrantyInformation: "5-year shelf life in dark, cool storage",
    shippingInformation: "Bulk carton shipping available",
    availabilityStatus: "Low Stock",
    reviews: [
      {
        rating: 5,
        comment: "Great elasticity and tear resistance. Doesn't cause allergy flare-ups.",
        date: "2026-08-30T13:10:00Z",
        reviewerName: "Clara Oswald",
        reviewerEmail: "clara.o@labservices.org",
      },
      {
        rating: 4,
        comment: "Good sizing consistency across batches. Reordering immediately.",
        date: "2026-08-14T09:40:00Z",
        reviewerName: "Dr. Marcus Vance",
        reviewerEmail: "m.vance@urgentcare.net",
      },
    ],
    returnPolicy: "Full refund if dispenser box seals are unbroken",
    minimumOrderQuantity: 2,
    meta: {
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2026-09-08T11:45:00Z",
      barcode: "8901234567892",
      qrCode: "https://placehold.co/150x150?text=QR-GLV-100",
    },
    thumbnail: "https://placehold.co/400x400?text=Nitrile+Gloves",
    images: [
      "https://placehold.co/600x600?text=Gloves+Dispenser",
      "https://placehold.co/600x600?text=Glove+Texture",
    ],
  },
  {
    id: 4,
    title: "Sterile Gauze Pads 10cm x 10cm",
    description: "100% pure absorbent cotton sterile 8-ply gauze pads. Individually wrapped peel-pouches designed for wound dressing, absorption, and surgical prep.",
    category: "supplies",
    price: 5.25,
    discountPercentage: 0.0,
    rating: 4.9,
    stock: 150,
    tags: ["wound-care", "gauze", "sterile", "surgical", "cotton"],
    brand: "MediPure Supplies",
    sku: "SUP-GAU-10",
    weight: 0.32,
    dimensions: {
      width: 14.0,
      height: 14.0,
      depth: 8.0,
    },
    warrantyInformation: "Sterility guaranteed unless pouch is damaged or opened",
    shippingInformation: "Standard clinic ground delivery (1-2 business days)",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "High absorbency and very clean edges with no loose threads.",
        date: "2026-09-01T15:10:00Z",
        reviewerName: "Sister Helen Gray",
        reviewerEmail: "h.gray@stjudes.org",
      },
    ],
    returnPolicy: "Eligible for exchange within 45 days if sterile packaging intact",
    minimumOrderQuantity: 5,
    meta: {
      createdAt: "2025-03-01T08:00:00Z",
      updatedAt: "2026-09-08T09:15:00Z",
      barcode: "8901234567893",
      qrCode: "https://placehold.co/150x150?text=QR-GAU-10",
    },
    thumbnail: "https://placehold.co/400x400?text=Sterile+Gauze+Pads",
    images: [
      "https://placehold.co/600x600?text=Gauze+Box",
      "https://placehold.co/600x600?text=Single+Pouch",
    ],
  },
  {
    id: 5,
    title: "Digital Blood Pressure Monitor",
    description: "Automated upper-arm oscillometric blood pressure monitor with arrhythmia indicator, WHO classification bar, and 2-user memory (99 readings each). Clinical grade accuracy.",
    category: "equipment",
    price: 45.0,
    discountPercentage: 10.0,
    rating: 4.5,
    stock: 7,
    tags: ["diagnostic", "cardio", "monitor", "digital", "equipment"],
    brand: "CardioCheck Pro",
    sku: "EQP-BP-001",
    weight: 0.85,
    dimensions: {
      width: 16.5,
      height: 11.2,
      depth: 8.4,
    },
    warrantyInformation: "3-year manufacturer replacement warranty with annual recalibration support",
    shippingInformation: "Fragile equipment packaging with shock-absorbing foam",
    availabilityStatus: "Low Stock",
    reviews: [
      {
        rating: 4,
        comment: "Very accurate readings compared to manual sphygmomanometer. Cuff fits most patients.",
        date: "2026-08-25T11:00:00Z",
        reviewerName: "Dr. David Miller",
        reviewerEmail: "d.miller@cardiohealth.com",
      },
    ],
    returnPolicy: "60-day trial with full return or replacement warranty",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2024-11-10T12:00:00Z",
      updatedAt: "2026-09-07T16:10:00Z",
      barcode: "8901234567894",
      qrCode: "https://placehold.co/150x150?text=QR-BP-001",
    },
    thumbnail: "https://placehold.co/400x400?text=BP+Monitor",
    images: [
      "https://placehold.co/600x600?text=Device+Front",
      "https://placehold.co/600x600?text=Cuff+Attachment",
      "https://placehold.co/600x600?text=Display+Screen",
    ],
  },
  {
    id: 6,
    title: "Infrared Thermometer",
    description: "Non-contact forehead and surface infrared thermometer with instant 1-second temperature readouts, color-coded fever alert backlight, and memory recall for 32 records.",
    category: "equipment",
    price: 22.5,
    discountPercentage: 0.0,
    rating: 4.8,
    stock: 18,
    tags: ["triage", "thermometer", "infrared", "non-contact", "equipment"],
    brand: "ThermoTech Clinical",
    sku: "EQP-THERM-01",
    weight: 0.22,
    dimensions: {
      width: 15.0,
      height: 9.0,
      depth: 4.0,
    },
    warrantyInformation: "2-year full equipment replacement warranty",
    shippingInformation: "Dispatched within 24 hours via express courier",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Lightning fast screening at clinic reception. Battery life is stellar.",
        date: "2026-09-02T10:30:00Z",
        reviewerName: "Nurse Lisa Ray",
        reviewerEmail: "lisa.ray@triagecare.org",
      },
    ],
    returnPolicy: "30-day satisfaction return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2025-01-05T09:00:00Z",
      updatedAt: "2026-09-06T13:40:00Z",
      barcode: "8901234567895",
      qrCode: "https://placehold.co/150x150?text=QR-THERM-01",
    },
    thumbnail: "https://placehold.co/400x400?text=Infrared+Thermometer",
    images: [
      "https://placehold.co/600x600?text=Thermometer+Side",
      "https://placehold.co/600x600?text=LCD+Screen",
    ],
  },
  {
    id: 7,
    title: "Surgical Face Masks",
    description: "Type IIR 3-ply surgical masks featuring a meltblown bacterial filtration layer (BFE ≥ 98%), fluid-resistant outer layer, comfortable elastic ear loops, and adjustable nose wire.",
    category: "protective equipment",
    price: 7.99,
    discountPercentage: 15.0,
    rating: 4.7,
    stock: 4,
    tags: ["ppe", "masks", "surgical", "type-iir", "infection-control"],
    brand: "ShieldCare Medical",
    sku: "PPE-MASK-50",
    weight: 0.2,
    dimensions: {
      width: 18.0,
      height: 10.0,
      depth: 7.5,
    },
    warrantyInformation: "5-year sterile shelf life",
    shippingInformation: "Ships standard ground; priority dispatch available",
    availabilityStatus: "Low Stock",
    reviews: [
      {
        rating: 5,
        comment: "Soft ear loops that do not irritate during long 12-hour shifts.",
        date: "2026-08-20T08:00:00Z",
        reviewerName: "Dr. James Wilson",
        reviewerEmail: "j.wilson@er-hospital.org",
      },
    ],
    returnPolicy: "Non-returnable once box tamper seal is broken",
    minimumOrderQuantity: 2,
    meta: {
      createdAt: "2025-02-15T08:00:00Z",
      updatedAt: "2026-09-05T10:25:00Z",
      barcode: "8901234567896",
      qrCode: "https://placehold.co/150x150?text=QR-MASK-50",
    },
    thumbnail: "https://placehold.co/400x400?text=Surgical+Masks",
    images: [
      "https://placehold.co/600x600?text=Mask+Box",
      "https://placehold.co/600x600?text=3-Ply+Layers",
    ],
  },
  {
    id: 8,
    title: "Antiseptic Solution 500ml",
    description: "Chlorhexidine Gluconate 0.5% in 70% v/v Ethanol antiseptic solution for pre-operative skin disinfection, wound cleaning, and procedural hygiene.",
    category: "medicines",
    price: 6.5,
    discountPercentage: 0.0,
    rating: 4.9,
    stock: 0,
    tags: ["antiseptic", "disinfection", "skin-prep", "chlorhexidine", "liquids"],
    brand: "GermiKill Labs",
    sku: "MED-ANTI-500",
    weight: 0.55,
    dimensions: {
      width: 7.0,
      height: 19.0,
      depth: 7.0,
    },
    warrantyInformation: "30-month shelf life; 6 months once opened",
    shippingInformation: "Regulated hazardous material transport",
    availabilityStatus: "Out of Stock",
    reviews: [
      {
        rating: 5,
        comment: "Gold standard skin prep solution. Waiting on backorder restock.",
        date: "2026-08-11T14:15:00Z",
        reviewerName: "Dr. Elena Rostova",
        reviewerEmail: "elena.r@surgerydept.org",
      },
    ],
    returnPolicy: "30-day sealed container return",
    minimumOrderQuantity: 4,
    meta: {
      createdAt: "2024-10-05T10:00:00Z",
      updatedAt: "2026-09-04T15:05:00Z",
      barcode: "8901234567897",
      qrCode: "https://placehold.co/150x150?text=QR-ANTI-500",
    },
    thumbnail: "https://placehold.co/400x400?text=Antiseptic+500ml",
    images: [
      "https://placehold.co/600x600?text=Bottle+Front",
      "https://placehold.co/600x600?text=Usage+Instructions",
    ],
  },
  {
    id: 9,
    title: "Syringes 5ml - Box of 100",
    description: "Sterile 3-part disposable syringes with Luer-lock tip, ultra-clear barrel with bold graduation markings, and smooth plunger motion for precise fluid delivery.",
    category: "supplies",
    price: 18.75,
    discountPercentage: 4.5,
    rating: 4.7,
    stock: 32,
    tags: ["syringes", "injection", "luer-lock", "sterile", "supplies"],
    brand: "Innoject Medical",
    sku: "SUP-SYR-5ML",
    weight: 0.72,
    dimensions: {
      width: 20.0,
      height: 14.0,
      depth: 10.0,
    },
    warrantyInformation: "5-year guaranteed sterility under intact blister packaging",
    shippingInformation: "Standard dry freight shipment",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Smooth glide plunger with leak-proof Luer lock fit.",
        date: "2026-08-28T09:10:00Z",
        reviewerName: "Nurse Patrick Bell",
        reviewerEmail: "p.bell@immunization.org",
      },
    ],
    returnPolicy: "Eligible for refund if original manufacturer seal unbroken",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2025-01-18T14:00:00Z",
      updatedAt: "2026-09-03T12:30:00Z",
      barcode: "8901234567898",
      qrCode: "https://placehold.co/150x150?text=QR-SYR-5ML",
    },
    thumbnail: "https://placehold.co/400x400?text=5ml+Syringes",
    images: [
      "https://placehold.co/600x600?text=Syringe+Box",
      "https://placehold.co/600x600?text=Barrel+Graduations",
    ],
  },
  {
    id: 10,
    title: "Hand Sanitizer 500ml",
    description: "75% ethyl alcohol instant rinse-free hand sanitizer gel infused with aloe vera and Vitamin E to prevent dryness during frequent clinical hand disinfection.",
    category: "protective equipment",
    price: 4.99,
    discountPercentage: 0.0,
    rating: 4.6,
    stock: 9,
    tags: ["sanitizer", "hygiene", "alcohol", "infection-control", "ppe"],
    brand: "CleanPure Clinical",
    sku: "PPE-SANI-500",
    weight: 0.52,
    dimensions: {
      width: 7.5,
      height: 18.5,
      depth: 7.5,
    },
    warrantyInformation: "36 months shelf life",
    shippingInformation: "Standard clinic ground delivery",
    availabilityStatus: "Low Stock",
    reviews: [
      {
        rating: 5,
        comment: "Fast drying, no sticky residue, and gentle on skin even after 50 uses a day.",
        date: "2026-08-15T11:40:00Z",
        reviewerName: "Hannah Brooks",
        reviewerEmail: "h.brooks@communityhealth.net",
      },
    ],
    returnPolicy: "30-day return policy for unopened bottles",
    minimumOrderQuantity: 2,
    meta: {
      createdAt: "2025-02-22T11:00:00Z",
      updatedAt: "2026-09-02T08:50:00Z",
      barcode: "8901234567899",
      qrCode: "https://placehold.co/150x150?text=QR-SANI-500",
    },
    thumbnail: "https://placehold.co/400x400?text=Hand+Sanitizer",
    images: [
      "https://placehold.co/600x600?text=Pump+Bottle",
      "https://placehold.co/600x600?text=Gel+Consistency",
    ],
  },
  {
    id: 11,
    title: "Ibuprofen 400mg Tablets",
    description: "Non-steroidal anti-inflammatory drug (NSAID) indicated for relief of symptoms of arthritis, primary dysmenorrhea, muscular aches, and acute inflammatory pain.",
    category: "medicines",
    price: 4.25,
    discountPercentage: 6.0,
    rating: 4.8,
    stock: 110,
    tags: ["nsaid", "analgesic", "anti-inflammatory", "tablets", "otc"],
    brand: "PharmaCare Labs",
    sku: "MED-IBU-400",
    weight: 0.22,
    dimensions: {
      width: 8.0,
      height: 4.0,
      depth: 2.0,
    },
    warrantyInformation: "24 months shelf life",
    shippingInformation: "Dispatched within 24h",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Great quality anti-inflammatory for outpatient pharmacy.",
        date: "2026-08-20T12:00:00Z",
        reviewerName: "Dr. Karen Wood",
        reviewerEmail: "k.wood@familycare.org",
      },
    ],
    returnPolicy: "30-day unopened return",
    minimumOrderQuantity: 5,
    meta: {
      createdAt: "2025-01-10T10:00:00Z",
      updatedAt: "2026-09-01T11:20:00Z",
      barcode: "8901234567900",
      qrCode: "https://placehold.co/150x150?text=QR-IBU-400",
    },
    thumbnail: "https://placehold.co/400x400?text=Ibuprofen+400mg",
    images: [
      "https://placehold.co/600x600?text=Ibuprofen+Box",
    ],
  },
  {
    id: 12,
    title: "Medical Diagnostic Stethoscope",
    description: "Dual-head stainless steel clinical stethoscope featuring tunable diaphragm, high acoustic sensitivity, anatomically aligned headset, and soft-sealing eartips.",
    category: "equipment",
    price: 58.0,
    discountPercentage: 10.0,
    rating: 4.9,
    stock: 5,
    tags: ["diagnostic", "stethoscope", "auscultation", "cardio", "equipment"],
    brand: "AcoustiMed Instruments",
    sku: "EQP-STETH-02",
    weight: 0.38,
    dimensions: {
      width: 70.0,
      height: 4.5,
      depth: 2.0,
    },
    warrantyInformation: "5-year manufacturer full acoustic warranty",
    shippingInformation: "Padded instrument box with tracking",
    availabilityStatus: "Low Stock",
    reviews: [
      {
        rating: 5,
        comment: "Superior acoustic clarity for heart sounds and lung crackles.",
        date: "2026-08-15T09:30:00Z",
        reviewerName: "Dr. Samuel Bennett",
        reviewerEmail: "s.bennett@cardiology.med",
      },
    ],
    returnPolicy: "30-day trial return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2024-12-01T08:00:00Z",
      updatedAt: "2026-08-30T10:00:00Z",
      barcode: "8901234567901",
      qrCode: "https://placehold.co/150x150?text=QR-STETH-02",
    },
    thumbnail: "https://placehold.co/400x400?text=Stethoscope",
    images: [
      "https://placehold.co/600x600?text=Chestpiece+Detail",
      "https://placehold.co/600x600?text=Full+Stethoscope",
    ],
  },
  {
    id: 13,
    title: "Medical Full Face Shield",
    description: "Anti-fog optically clear PET full-face protection shield with breathable foam headband and elastic strap for splash, droplet, and aerosol defense.",
    category: "protective equipment",
    price: 9.5,
    discountPercentage: 5.0,
    rating: 4.7,
    stock: 45,
    tags: ["ppe", "face-shield", "anti-fog", "protection", "infection-control"],
    brand: "ShieldCare Medical",
    sku: "PPE-SHIELD-10",
    weight: 0.15,
    dimensions: {
      width: 32.0,
      height: 22.0,
      depth: 3.0,
    },
    warrantyInformation: "3-year protective coating guarantee",
    shippingInformation: "Protective film packed",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Crystal clear vision, does not fog even with heavy mask usage.",
        date: "2026-08-20T14:00:00Z",
        reviewerName: "Nurse Timothy Ward",
        reviewerEmail: "t.ward@traumacare.org",
      },
    ],
    returnPolicy: "Full refund if protective film intact",
    minimumOrderQuantity: 5,
    meta: {
      createdAt: "2025-01-25T11:00:00Z",
      updatedAt: "2026-08-28T14:15:00Z",
      barcode: "8901234567902",
      qrCode: "https://placehold.co/150x150?text=QR-SHIELD-10",
    },
    thumbnail: "https://placehold.co/400x400?text=Face+Shield",
    images: [
      "https://placehold.co/600x600?text=Face+Shield+Front",
    ],
  },
  {
    id: 14,
    title: "Elastic Crepe Bandage 10cm x 4.5m",
    description: "High-stretch woven cotton elastic crepe bandage for joint support, compression therapy, sprain management, and dressing retention.",
    category: "supplies",
    price: 3.2,
    discountPercentage: 0.0,
    rating: 4.8,
    stock: 65,
    tags: ["bandage", "compression", "first-aid", "orthopedic", "supplies"],
    brand: "MediPure Supplies",
    sku: "SUP-BAND-10",
    weight: 0.08,
    dimensions: {
      width: 10.0,
      height: 6.0,
      depth: 6.0,
    },
    warrantyInformation: "5-year shelf life",
    shippingInformation: "Standard clinic delivery",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Excellent elasticity and washable for repeated clinic use.",
        date: "2026-08-22T10:15:00Z",
        reviewerName: "PT Gary Thorne",
        reviewerEmail: "g.thorne@physioclinic.org",
      },
    ],
    returnPolicy: "30-day unopened package return",
    minimumOrderQuantity: 5,
    meta: {
      createdAt: "2025-02-01T09:00:00Z",
      updatedAt: "2026-08-27T09:40:00Z",
      barcode: "8901234567903",
      qrCode: "https://placehold.co/150x150?text=QR-BAND-10",
    },
    thumbnail: "https://placehold.co/400x400?text=Crepe+Bandage",
    images: [
      "https://placehold.co/600x600?text=Bandage+Roll",
    ],
  },
  {
    id: 15,
    title: "Sodium Chloride 0.9% Saline 500ml",
    description: "Sterile non-pyrogenic isotonic 0.9% Sodium Chloride irrigation and infusion solution in flexible container for wound cleansing, device flushing, and fluid replacement.",
    category: "medicines",
    price: 5.9,
    discountPercentage: 0.0,
    rating: 4.9,
    stock: 80,
    tags: ["saline", "iv-fluid", "sterile", "irrigation", "essential"],
    brand: "BioMedix Pharmaceuticals",
    sku: "MED-SAL-500",
    weight: 0.58,
    dimensions: {
      width: 10.0,
      height: 18.0,
      depth: 6.0,
    },
    warrantyInformation: "24-month sterile shelf life",
    shippingInformation: "Temperature-controlled freight",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Reliable sterility and easy-to-puncture port. Essential clinic stock.",
        date: "2026-08-19T13:40:00Z",
        reviewerName: "Dr. Fiona Gallagher",
        reviewerEmail: "f.gallagher@emergencycare.med",
      },
    ],
    returnPolicy: "Non-returnable once external wrap is compromised",
    minimumOrderQuantity: 6,
    meta: {
      createdAt: "2025-01-08T08:00:00Z",
      updatedAt: "2026-08-25T16:50:00Z",
      barcode: "8901234567904",
      qrCode: "https://placehold.co/150x150?text=QR-SAL-500",
    },
    thumbnail: "https://placehold.co/400x400?text=Saline+0.9%",
    images: [
      "https://placehold.co/600x600?text=Saline+Bag",
    ],
  },
]

const STORAGE_KEY = "stock_console_products_override"

export function getProductList(): Product[] {
  if (typeof window === "undefined") {
    return initialProducts
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const overrides: Record<number, { stock: number; availabilityStatus: string; updatedAt: string }> = JSON.parse(saved)
      return initialProducts.map((p) => {
        if (overrides[p.id]) {
          return {
            ...p,
            stock: overrides[p.id].stock,
            availabilityStatus: overrides[p.id].availabilityStatus,
            meta: {
              ...p.meta,
              updatedAt: overrides[p.id].updatedAt,
            },
          }
        }
        return p
      })
    }
  } catch (err) {
    console.error("Failed to load products from localStorage", err)
  }

  return initialProducts
}

export function getProductById(id: number): Product | undefined {
  const list = getProductList()
  return list.find((p) => p.id === id)
}

export function updateProductStock(id: number, newStock: number): Product | null {
  const list = getProductList()
  const product = list.find((p) => p.id === id)
  if (!product) return null

  let availabilityStatus = "In Stock"
  if (newStock === 0) {
    availabilityStatus = "Out of Stock"
  } else if (newStock <= 15) {
    availabilityStatus = "Low Stock"
  }

  const updatedAt = new Date().toISOString()

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const overrides = saved ? JSON.parse(saved) : {}
      overrides[id] = {
        stock: newStock,
        availabilityStatus,
        updatedAt,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
      window.dispatchEvent(new Event("stock_updated"))
    } catch (err) {
      console.error("Failed to save stock update", err)
    }
  }

  return {
    ...product,
    stock: newStock,
    availabilityStatus,
    meta: {
      ...product.meta,
      updatedAt,
    },
  }
}
