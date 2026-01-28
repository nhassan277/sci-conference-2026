import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Committees() {
  const committees = [
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
      nameAr: "علم الحيوان",
      nameEn: "Zoology",
      chair: {
        nameAr: "أ.د. سلوى عبدالحميد",
        nameEn: "Prof. Dr. Salwa Abdelhamid"
      },
      members: [
        { nameAr: "أ.د. سلوى ثابت", nameEn: "Prof. Dr. Salwa Thabet" }
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Scientific Committees
            </h1>
            <p className="text-3xl font-semibold" dir="rtl">
              اللجان العلمية
            </p>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Distinguished faculty members leading the scientific tracks of SCI 2026
            </p>
            <p className="text-base md:text-lg text-blue-100" dir="rtl">
              أعضاء هيئة التدريس المتميزون الذين يقودون المحاور العلمية للمؤتمر
            </p>
          </div>
        </div>
      </section>

      {/* Committees Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-xl">
                    <div className="space-y-2">
                      <div className="text-primary font-bold">
                        {committee.nameEn}
                      </div>
                      <div className="text-lg text-secondary" dir="rtl">
                        {committee.nameAr}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Chair */}
                  <div className="border-b pb-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Chair / رئيس القسم
                    </p>
                    <p className="font-bold text-primary">
                      {committee.chair.nameEn}
                    </p>
                    <p className="text-sm text-secondary" dir="rtl">
                      {committee.chair.nameAr}
                    </p>
                  </div>

                  {/* Members */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      Committee Members / أعضاء اللجنة
                    </p>
                    <ul className="space-y-2">
                      {committee.members.map((member, idx) => (
                        <li key={idx} className="text-sm">
                          <p className="font-medium text-gray-900">
                            {member.nameEn}
                            {member.titleEn && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({member.titleEn})
                              </span>
                            )}
                          </p>
                          <p className="text-gray-600" dir="rtl">
                            {member.nameAr}
                            {member.title && (
                              <span className="text-xs mr-2">
                                ({member.title})
                              </span>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-12 bg-blue-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              The Scientific Committees are responsible for reviewing submissions, 
              organizing sessions, and ensuring the academic quality of the conference.
            </p>
            <p className="text-sm text-muted-foreground" dir="rtl">
              اللجان العلمية مسؤولة عن مراجعة المشاركات وتنظيم الجلسات وضمان الجودة الأكاديمية للمؤتمر.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
