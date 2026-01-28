import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Committees() {
  const committees = [
    {
      nameAr: "الفلك والفضاء والأرصاد الجوية",
      nameEn: "Department of Astronomy, Space Science and Meteorology",
      chair: "Prof. Dr. Fawzy Ahmed Abdel-Salam",
      members: [
        "Prof. Dr. Mohamed Magdy Abdel-Wahab",
        "Prof. Dr. Osama Shalabya",
        "Prof. Dr. Alaa El-Din Mohamed Fouad",
        "Dr. Hussein Mohamed Farid"
      ]
    },
    {
      nameAr: "الفيزياء الحيوية",
      nameEn: "Department of Biophysics",
      chair: "Dr. Mohamed Hassanein Gaber",
      members: [
        "Dr. Mahmoud"
      ]
    },
    {
      nameAr: "التقنية الحيوية",
      nameEn: "Department of Biotechnology",
      chair: "Prof. Dr. Refaat Gabre",
      members: [
        "Dr. Tarek Kabil",
        "Prof. Dr. Ahmed Fouad",
        "Dr. Dina Amr",
        "Dr. Nahla Osama"
      ]
    },
    {
      nameAr: "علم النبات",
      nameEn: "Department of Botany",
      chair: "Prof. Dr. Tarek Abdel-Mawgoud",
      members: [
        "Prof. Dr. Maimoona Kord",
        "Prof. Dr. Walid Abo-ElSooad",
        "Prof. Dr. Hanaa Badawy",
        "Prof. Dr. Sherif Elnagdy"
      ]
    },
    {
      nameAr: "الكيمياء",
      nameEn: "Department of Chemistry",
      chair: "Prof. Dr. Tayseer Abdel-Khaleq Abdullah",
      members: [
        "Prof. Dr. Ahmed Elwahy"
      ]
    },
    {
      nameAr: "علم الحشرات",
      nameEn: "Department of Entomology",
      chair: "Dr. Nagwa Rashdan",
      members: [
        "Dr. Youssef"
      ]
    },
    {
      nameAr: "الجيولوجيا",
      nameEn: "Department of Geology",
      chair: "Prof. Dr. Hany Abdel-Hamid",
      members: [
        "Prof. Dr. Hossam El-Din Hassan",
        "Dr. Walid Abdullah",
        "Dr. Mohamed Hassan"
      ]
    },
    {
      nameAr: "الجيوفيزياء",
      nameEn: "Department of Geophysics",
      chair: "Dr. Walid Mabrouk",
      members: [
        "Prof. Dr. Mohamed Hassan",
        "Dr. Ahmed Mohsen"
      ]
    },
    {
      nameAr: "الرياضيات",
      nameEn: "Department of Mathematics",
      chair: "Prof. Dr. Nasser El-Azab",
      members: [
        "Prof. Dr. Ahmed El-Gendy",
        "Dr. Walid Abdullah",
        "Prof. Dr. Mohamed El-Zawawi"
      ]
    },
    {
      nameAr: "الفيزياء",
      nameEn: "Department of Physics",
      chair: "Prof. Dr. Manal Makram Saad",
      members: [
        "Prof. Dr. Gamal Abdel-Nasser",
        "Prof. Dr. Abeer Abdullah",
        "Dr. Mohamed Mostafa Arman"
      ]
    },
    {
      nameAr: "علم الحيوان",
      nameEn: "Department of Zoology",
      chair: "Prof. Dr. Salwa Abdelhamid",
      members: [
        "Prof. Dr. Salwa Thabet"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Scientific Committees</h1>
            <p className="text-2xl font-semibold" dir="rtl">اللجان العلمية</p>
            <p className="text-lg max-w-2xl mx-auto">
              Distinguished faculty members leading the scientific organization of SCI 2026
            </p>
          </div>
        </div>
      </section>

      {/* Committees Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-primary leading-tight">{committee.nameEn}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground mt-1" dir="rtl">
                    {committee.nameAr}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
                      Chair
                    </p>
                    <p className="font-medium text-sm">{committee.chair}</p>
                  </div>
                  {committee.members.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
                        Committee Members
                      </p>
                      <ul className="space-y-1.5">
                        {committee.members.map((member, idx) => (
                          <li key={idx}>
                            <p className="text-sm">{member}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
