import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone } from "lucide-react";

export default function Committees() {
  const { data, isLoading } = trpc.committee.list.useQuery();

  const committeeTypeLabels: Record<string, { en: string; ar: string }> = {
    scientific: { en: "Scientific Committee", ar: "اللجنة العلمية" },
    organizing: { en: "Organizing Committee", ar: "اللجنة التنظيمية" },
    reception: { en: "Reception Committee", ar: "لجنة الاستقبال" },
    technical: { en: "Technical Committee", ar: "اللجنة الفنية" },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading committees...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Conference Committees</h1>
            <p className="text-2xl font-semibold" dir="rtl">لجان المؤتمر</p>
            <p className="text-lg max-w-2xl mx-auto">
              Distinguished faculty and staff members organizing SCI 2026
            </p>
          </div>
        </div>
      </section>

      {/* Committees by Type */}
      <section className="py-16">
        <div className="container space-y-12">
          {Object.entries(data?.grouped || {}).map(([type, members]) => (
            <div key={type}>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
                  <Users className="w-8 h-8" />
                  {committeeTypeLabels[type]?.en || type}
                </h2>
                <p className="text-xl font-semibold text-muted-foreground mt-2" dir="rtl">
                  {committeeTypeLabels[type]?.ar || type}
                </p>
              </div>

              {/* Group by department for scientific committees */}
              {type === "scientific" ? (
                <div className="space-y-8">
                  {Object.entries(
                    members.reduce((acc, member) => {
                      const dept = member.department || "General";
                      if (!acc[dept]) acc[dept] = [];
                      acc[dept].push(member);
                      return acc;
                    }, {} as Record<string, typeof members>)
                  ).map(([department, deptMembers]) => (
                    <Card key={department} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                        <CardTitle className="text-xl text-primary">{department}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {deptMembers.map((member) => (
                            <div key={member.id} className="space-y-2 p-4 border rounded-lg bg-white">
                              <div className="font-semibold text-primary">
                                {member.title} {member.fullName}
                              </div>
                              {member.role && (
                                <div className="text-sm text-orange-600 font-medium">
                                  {member.role}
                                </div>
                              )}
                              {member.email && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  <a href={`mailto:${member.email}`} className="hover:text-primary">
                                    {member.email}
                                  </a>
                                </div>
                              )}
                              {member.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {member.phone}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.map((member) => (
                        <div key={member.id} className="space-y-2 p-4 border rounded-lg bg-white">
                          <div className="font-semibold text-primary">
                            {member.title} {member.fullName}
                          </div>
                          {member.role && (
                            <div className="text-sm text-orange-600 font-medium">
                              {member.role}
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${member.email}`} className="hover:text-primary">
                                {member.email}
                              </a>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}

          {(!data?.committees || data.committees.length === 0) && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Committee information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
