import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Committees() {
  const committees = [
    {
      nameAr: "الفلك",
      nameEn: "Astronomy",
      chair: {
        nameAr: "أ.د. فوزي أحمد عبد السلام",
        nameEn: "Prof. Dr. Fawzy Ahmed Abdel-Salam"
      },
      members: [
        { nameAr: "أ.د. محمد مجدي عبد الوهاب", nameEn: "Prof. Dr. Mohamed Magdy Abdel-Wahab" },
        { nameAr: "أ.د. أسامة شلبية", nameEn: "Prof. Dr. Osama Shalabya" },
        { nameAr: "أ.د. علاء الدين محمد فؤاد", nameEn: "Prof. Dr. Alaa El-Din Mohamed Fouad" },
        { nameAr: "د. حسين محمد فريد", nameEn: "Dr. Hussein Mohamed Farid" }
      ]
    },
    {
      nameAr: "الفيزياء الحيوية",
      nameEn: "Biophysics",
      chair: {
        nameAr: "د. محمد حسنين جابر",
        nameEn: "Dr. Mohamed Hassanein Gaber"
      },
      members: [
        { nameAr: "د. محمود", nameEn: "Dr. Mahmoud" }
      ]
    },
    {
      nameAr: "التقنية الحيوية",
      nameEn: "Biotechnology",
      chair: {
        nameAr: "أ.د. رفعت جبر",
        nameEn: "Prof. Dr. Refaat Gabr"
      },
      members: [
        { nameAr: "د. طارق قابيل", nameEn: "Dr. Tarek Qabil" },
        { nameAr: "أ.د. أحمد فؤاد", nameEn: "Prof. Dr. Ahmed Fouad" },
        { nameAr: "د. دينا عمرو", nameEn: "Dr. Dina Amr" },
        { nameAr: "د. نهلة أسامة", nameEn: "Dr. Nahla Osama" }
      ]
    },
    {
      nameAr: "علم النبات",
      nameEn: "Botany",
      chair: {
        nameAr: "أ.د. طارق عبد الموجود",
        nameEn: "Prof. Dr. Tarek Abdel-Mawgoud"
      },
      members: [
        { nameAr: "أ.د. ميمونة كرد", nameEn: "Prof. Dr. Maimoona Kord" },
        { nameAr: "أ.د. وليد أبو السعود", nameEn: "Prof. Dr. Walid Abo-ElSooad" },
        { nameAr: "أ.د. هناء بدوي", nameEn: "Prof. Dr. Hanaa Badawy" },
        { nameAr: "أ.د. شريف النجدي", nameEn: "Prof. Dr. Sherif Elnagdy" }
      ]
    },
    {
      nameAr: "الكيمياء",
      nameEn: "Chemistry",
      chair: {
        nameAr: "أ.د. تيسير عبدالخالق عبدالله",
        nameEn: "Prof. Dr. Tayseer Abdel-Khaleq Abdullah"
      },
      members: [
        { nameAr: "أ.د. أحمد الواحي", nameEn: "Prof. Dr. Ahmed Elwahy" }
      ]
    },
    {
      nameAr: "علم الحشرات",
      nameEn: "Entomology",
      chair: {
        nameAr: "د. نجوى رشدان",
        nameEn: "Dr. Nagwa Rashdan"
      },
      members: [
        { nameAr: "د. يوسف", nameEn: "Dr. Youssef" }
      ]
    },
    {
      nameAr: "الجيولوجيا",
      nameEn: "Geology",
      chair: {
        nameAr: "أ.د. هاني عبد الحميد",
        nameEn: "Prof. Dr. Hany Abdel-Hamid"
      },
      members: [
        { nameAr: "أ.د. حسام الدين حسن", nameEn: "Prof. Dr. Hossam El-Din Hassan" },
        { nameAr: "د. وليد عبد الله", nameEn: "Dr. Walid Abdullah" },
        { nameAr: "د. محمد حسن", nameEn: "Dr. Mohamed Hassan" }
      ]
    },
    {
      nameAr: "الجيوفيزياء",
      nameEn: "Geophysics",
      chair: {
        nameAr: "د. وليد مبروك",
        nameEn: "Dr. Walid Mabrouk"
      },
      members: [
        { nameAr: "أ.د. محمد حسن", nameEn: "Prof. Dr. Mohamed Hassan" },
        { nameAr: "د. أحمد محسن", nameEn: "Dr. Ahmed Mohsen" }
      ]
    },
    {
      nameAr: "الرياضيات",
      nameEn: "Mathematics",
      chair: {
        nameAr: "أ.د. ناصر العزب",
        nameEn: "Prof. Dr. Nasser El-Azab"
      },
      members: [
        { nameAr: "أ.د. أحمد الجندي", nameEn: "Prof. Dr. Ahmed El-Gendy" },
        { nameAr: "د. وليد عبد الله", nameEn: "Dr. Walid Abdullah" },
        { nameAr: "أ.د. محمد الزواوي", nameEn: "Prof. Dr. Mohamed El-Zawawi" }
      ]
    },
    {
      nameAr: "الفيزياء",
      nameEn: "Physics",
      chair: {
        nameAr: "أ.د. منال مكرم سعد",
        nameEn: "Prof. Dr. Manal Makram Saad"
      },
      members: [
        { nameAr: "أ.د. جمال عبد الناصر", nameEn: "Prof. Dr. Gamal Abdel-Nasser" },
        { nameAr: "أ.د. عبير عبد الله", nameEn: "Prof. Dr. Abeer Abdullah" },
        { nameAr: "د. محمد مصطفى عرمان", nameEn: "Dr. Mohamed Mostafa Arman" }
      ]
    },
    {
      nameAr: "علم الحيوان",
      nameEn: "Zoology",
      chair: {
        nameAr: "أ.د. سلوى عبدالحميد",
        nameEn: "Prof. Dr. Salwa Abdelhamid"
      },
      members: [
        { nameAr: "أ.د. سلوى ثابت", nameEn: "Prof. Dr. Salwa Thabet" }
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
                  <CardTitle className="text-xl text-primary">{committee.nameEn}</CardTitle>
                  <CardDescription className="text-base font-medium" dir="rtl">
                    {committee.nameAr}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Chair / رئيس القسم
                    </p>
                    <p className="font-medium">{committee.chair.nameEn}</p>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {committee.chair.nameAr}
                    </p>
                  </div>
                  {committee.members.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        Committee Members / أعضاء اللجنة
                      </p>
                      <ul className="space-y-2">
                        {committee.members.map((member, idx) => (
                          <li key={idx}>
                            <p className="text-sm font-medium">{member.nameEn}</p>
                            <p className="text-xs text-muted-foreground" dir="rtl">
                              {member.nameAr}
                            </p>
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
