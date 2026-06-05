export default function CategoryMenu() {
  const categories = [
    {
      name: "Electronic Accessories",
      subcategories: [
        {
          name: "Mobile Accessories",
          items: [
            "Tablet Accessories",
            "Cables & Converters",
            "Phone Cases",
            "Car Mounts",
            "Parts & Tools",
            "Screen Protectors",
            "Power Banks",
            "Selfie Sticks",
            "Car Chargers",
            "Wall Chargers",
          ],
        },
        {
          name: "Camera Accessories",
          items: [
            "Gimbals & Stabilizers",
            "Action Camera Accessories",
            "Lenses",
            "Tripods & Monopods",
            "Memory Cards",
            "Batteries",
            "Lighting & Studio Equipment",
          ],
        },
        {
          name: "Wearable",
          items: ["Fitness & Activity Trackers", "Virtual Reality"],
        },
      ],
    },
    {
      name: "TV & Home Appliances",
      subcategories: [],
    },
    {
      name: "Health & Beauty",
      subcategories: [],
    },
    {
      name: "Mother & Baby",
      subcategories: [],
    },
    {
      name: "Electronic Devices",
      subcategories: [],
    },
    {
      name: "Groceries & Pets",
      subcategories: [],
    },
    {
      name: "Home & Lifestyle",
      subcategories: [],
    },
    {
      name: "Women's Fashion",
      subcategories: [],
    },
    {
      name: "Men's Fashion",
      subcategories: [],
    },
    {
      name: "Watches, Bags & Jewellery",
      subcategories: [],
    },
    {
      name: "Sports & Outdoor",
      subcategories: [],
    },
    {
      name: "Automotive & Motorbike",
      subcategories: [],
    },
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="w-[280px] rounded-2xl border bg-white shadow-lg overflow-hidden group">
        {/* Header */}
        <div className="border-b bg-muted/40 px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight">Categories</h2>
        </div>

        {/* Menu */}
        <div className="relative">
          <ul className="flex flex-col">
            {categories.map((category, index) => (
              <li
                key={index}
                className="group/item flex items-center justify-between px-5 py-3 text-sm cursor-pointer transition-colors hover:bg-muted"
              >
                <span className="font-medium text-gray-700">
                  {category.name}
                </span>

                {/* Mega Menu */}
                {category.subcategories.length > 0 && (
                  <div className="invisible absolute left-full top-0 z-50 ml-2 opacity-0 transition-all duration-200 group-hover/item:visible group-hover/item:opacity-100">
                    <div className="w-[720px] rounded-2xl border bg-white p-6 shadow-2xl">
                      <div className="grid grid-cols-3 gap-8">
                        {category.subcategories.map((sub, subIndex) => (
                          <div key={subIndex}>
                            <h3 className="mb-4 text-sm font-semibold text-black">
                              {sub.name}
                            </h3>

                            <ul className="space-y-2">
                              {sub.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-black"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
