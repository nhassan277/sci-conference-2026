import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Coffee,
  Award,
  Presentation,
  MessageSquare
} from "lucide-react";

// Conference program data from official schedule
const sessions = {
  day1: [
    {
      id: 1,
      time: "09:00 - 10:00",
      timeAr: "٩:٠٠ - ١٠:٠٠",
      type: "registration",
      title: "Arrival & Registration",
      titleAr: "الوصول والتسجيل",
      location: "Conference Hall Entrance",
      locationAr: "مدخل قاعة المؤتمرات",
      description: "Welcome and registration for all conference participants",
      descriptionAr: "الترحيب والتسجيل لجميع المشاركين في المؤتمر"
    },
    {
      id: 2,
      time: "10:00 - 10:45",
      timeAr: "١٠:٠٠ - ١٠:٤٥",
      type: "opening",
      title: "Welcome Talk",
      titleAr: "كلمة الترحيب",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "Opening ceremony with welcome addresses from university leadership",
      descriptionAr: "حفل الافتتاح مع كلمات ترحيبية من قيادة الجامعة"
    },
    {
      id: 3,
      time: "10:45 - 11:10",
      timeAr: "١٠:٤٥ - ١١:١٠",
      type: "keynote",
      title: "Keynote Speaker 1",
      titleAr: "المتحدث الرئيسي ١",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "First keynote presentation",
      descriptionAr: "العرض الرئيسي الأول"
    },
    {
      id: 4,
      time: "11:10 - 11:35",
      timeAr: "١١:١٠ - ١١:٣٥",
      type: "keynote",
      title: "Keynote Speaker 2",
      titleAr: "المتحدث الرئيسي ٢",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "Second keynote presentation",
      descriptionAr: "العرض الرئيسي الثاني"
    },
    {
      id: 5,
      time: "11:35 - 11:50",
      timeAr: "١١:٣٥ - ١١:٥٠",
      type: "panel",
      title: "Discussion Panel",
      titleAr: "حلقة نقاش",
      location: "All Halls",
      locationAr: "جميع القاعات",
      description: "Interactive discussion following keynote presentations",
      descriptionAr: "نقاش تفاعلي بعد العروض الرئيسية"
    },
    {
      id: 6,
      time: "11:50 - 12:10",
      timeAr: "١١:٥٠ - ١٢:١٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 1",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ١",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 1" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Invited Speaker 1" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 1" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Participant Speaker 1" }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop", nameAr: "ورشة عمل MARC" }
      ]
    },
    {
      id: 7,
      time: "12:10 - 12:30",
      timeAr: "١٢:١٠ - ١٢:٣٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 2",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٢",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 2" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Invited Speaker 2" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 2" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Participant Speaker 2" }
      ],
      workshops: [
        { room: "Workshop Room 1", roomAr: "غرفة ورشة العمل ١", name: "MARC Workshop", nameAr: "ورشة عمل MARC" }
      ]
    },
    {
      id: 8,
      time: "12:30 - 12:45",
      timeAr: "١٢:٣٠ - ١٢:٤٥",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Parallel discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش متوازية في جميع قاعات المؤتمر"
    },
    {
      id: 9,
      time: "12:45 - 13:30",
      timeAr: "١٢:٤٥ - ١٣:٣٠",
      type: "break",
      title: "Coffee Break",
      titleAr: "استراحة قهوة",
      location: "Conference Foyer",
      locationAr: "ردهة المؤتمر",
      description: "Refreshments and networking opportunity",
      descriptionAr: "المرطبات وفرصة للتواصل"
    },
    {
      id: 10,
      time: "13:30 - 13:50",
      timeAr: "١٣:٣٠ - ١٣:٥٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 3",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٣",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 3" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Invited Speaker 3" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 3" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Participant Speaker 3" }
      ],
      workshops: [
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" }
      ]
    },
    {
      id: 11,
      time: "13:50 - 14:10",
      timeAr: "١٣:٥٠ - ١٤:١٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 4",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٤",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 4" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Invited Speaker 4" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 4" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Participant Speaker 4" }
      ],
      workshops: [
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" }
      ]
    },
    {
      id: 12,
      time: "14:10 - 14:30",
      timeAr: "١٤:١٠ - ١٤:٣٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 5",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٥",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 5" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Invited Speaker 5" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 5" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other sciences", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى", speaker: "Participant Speaker 5" }
      ],
      workshops: [
        { room: "Workshop Room 2", roomAr: "غرفة ورشة العمل ٢", name: "MARC Workshop (Cont.)", nameAr: "ورشة عمل MARC (تابع)" }
      ]
    },
    {
      id: 13,
      time: "14:30 - 14:50",
      timeAr: "١٤:٣٠ - ١٤:٥٠",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Parallel discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش متوازية في جميع قاعات المؤتمر"
    },
    {
      id: 14,
      time: "14:50 - 15:30",
      timeAr: "١٤:٥٠ - ١٥:٣٠",
      type: "poster",
      title: "Poster Session",
      titleAr: "جلسة الملصقات",
      location: "Conference Foyer",
      locationAr: "ردهة المؤتمر",
      description: "Poster presentations and networking",
      descriptionAr: "عروض الملصقات والتواصل"
    }
  ],
  day2: [
    {
      id: 15,
      time: "09:00 - 09:30",
      timeAr: "٩:٠٠ - ٩:٣٠",
      type: "registration",
      title: "Arrival & Registration",
      titleAr: "الوصول والتسجيل",
      location: "Conference Hall Entrance",
      locationAr: "مدخل قاعة المؤتمرات",
      description: "Registration for Day 2 participants",
      descriptionAr: "التسجيل للمشاركين في اليوم الثاني"
    },
    {
      id: 16,
      time: "09:30 - 09:55",
      timeAr: "٩:٣٠ - ٩:٥٥",
      type: "keynote",
      title: "Keynote Speaker 1",
      titleAr: "المتحدث الرئيسي ١",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "First keynote presentation of Day 2",
      descriptionAr: "العرض الرئيسي الأول لليوم الثاني"
    },
    {
      id: 17,
      time: "09:55 - 10:20",
      timeAr: "٩:٥٥ - ١٠:٢٠",
      type: "keynote",
      title: "Keynote Speaker 2",
      titleAr: "المتحدث الرئيسي ٢",
      location: "Hall A (Connected to all halls)",
      locationAr: "القاعة أ (متصلة بجميع القاعات)",
      description: "Second keynote presentation of Day 2",
      descriptionAr: "العرض الرئيسي الثاني لليوم الثاني"
    },
    {
      id: 18,
      time: "10:20 - 10:35",
      timeAr: "١٠:٢٠ - ١٠:٣٥",
      type: "panel",
      title: "Discussion Panel & Workshop Start",
      titleAr: "حلقة نقاش وبداية ورشة العمل",
      location: "All Halls + Workshop Rooms",
      locationAr: "جميع القاعات + غرف ورش العمل",
      description: "Discussion panel and beginning of workshops",
      descriptionAr: "حلقة نقاش وبداية ورش العمل"
    },
    {
      id: 19,
      time: "10:35 - 10:55",
      timeAr: "١٠:٣٥ - ١٠:٥٥",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 1",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ١",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 1" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 1" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 1" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 1" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop", nameAr: "ورشة عمل نواة" }
      ]
    },
    {
      id: 20,
      time: "10:55 - 11:15",
      timeAr: "١٠:٥٥ - ١١:١٥",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 2",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٢",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 2" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 2" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 2" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 2" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop", nameAr: "ورشة عمل نواة" }
      ]
    },
    {
      id: 21,
      time: "11:15 - 11:35",
      timeAr: "١١:١٥ - ١١:٣٥",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 3",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٣",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 3" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 3" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 3" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 3" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop", nameAr: "ورشة عمل نواة" }
      ]
    },
    {
      id: 22,
      time: "11:35 - 11:55",
      timeAr: "١١:٣٥ - ١١:٥٥",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 4",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٤",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 4" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 4" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 4" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 4" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop", nameAr: "ورشة عمل نواة" }
      ]
    },
    {
      id: 23,
      time: "11:55 - 12:15",
      timeAr: "١١:٥٥ - ١٢:١٥",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Parallel discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش متوازية في جميع قاعات المؤتمر"
    },
    {
      id: 24,
      time: "12:15 - 12:50",
      timeAr: "١٢:١٥ - ١٢:٥٠",
      type: "break",
      title: "Coffee Break",
      titleAr: "استراحة قهوة",
      location: "Conference Foyer",
      locationAr: "ردهة المؤتمر",
      description: "Refreshments and networking opportunity",
      descriptionAr: "المرطبات وفرصة للتواصل"
    },
    {
      id: 25,
      time: "12:50 - 13:10",
      timeAr: "١٢:٥٠ - ١٣:١٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 5",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٥",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 5" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 5" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 5" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 5" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop (Cont.)", nameAr: "ورشة عمل نواة (تابع)" }
      ]
    },
    {
      id: 26,
      time: "13:10 - 13:30",
      timeAr: "١٣:١٠ - ١٣:٣٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 6",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٦",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 6" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 6" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 6" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 6" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop (Cont.)", nameAr: "ورشة عمل نواة (تابع)" }
      ]
    },
    {
      id: 27,
      time: "13:30 - 13:50",
      timeAr: "١٣:٣٠ - ١٣:٥٠",
      type: "parallel",
      title: "Parallel Sessions - Invited & Participant Speakers 7",
      titleAr: "جلسات متوازية - المتحدثون المدعوون والمشاركون ٧",
      tracks: [
        { hall: "Hall A", hallAr: "القاعة أ", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Invited Speaker 7" },
        { hall: "Hall B", hallAr: "القاعة ب", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Invited Speaker 7" },
        { hall: "Hall C", hallAr: "القاعة ج", topic: "Biological & Chemical Sciences", topicAr: "العلوم البيولوجية والكيميائية", speaker: "Participant Speaker 7" },
        { hall: "Hall D", hallAr: "القاعة د", topic: "Mathematics, Physics, Geology, Astronomy & other disciplines", topicAr: "الرياضيات، الفيزياء، الجيولوجيا، الفلك والتخصصات الأخرى", speaker: "Participant Speaker 7" }
      ],
      workshops: [
        { room: "Workshop Rooms 1 & 2", roomAr: "غرف ورشة العمل ١ و ٢", name: "Nawah Workshop (Cont.)", nameAr: "ورشة عمل نواة (تابع)" }
      ]
    },
    {
      id: 28,
      time: "13:50 - 14:05",
      timeAr: "١٣:٥٠ - ١٤:٠٥",
      type: "panel",
      title: "Discussion Panels",
      titleAr: "حلقات نقاش",
      location: "All Halls (A, B, C, D)",
      locationAr: "جميع القاعات (أ، ب، ج، د)",
      description: "Parallel discussion panels in all conference halls",
      descriptionAr: "حلقات نقاش متوازية في جميع قاعات المؤتمر"
    },
    {
      id: 29,
      time: "14:05 - 14:50",
      timeAr: "١٤:٠٥ - ١٤:٥٠",
      type: "poster",
      title: "Poster Session",
      titleAr: "جلسة الملصقات",
      location: "Conference Foyer",
      locationAr: "ردهة المؤتمر",
      description: "Poster presentations and networking",
      descriptionAr: "عروض الملصقات والتواصل"
    },
    {
      id: 30,
      time: "14:50 - 15:30",
      timeAr: "١٤:٥٠ - ١٥:٣٠",
      type: "closing",
      title: "Conference Closure & Awards Ceremony",
      titleAr: "حفل الختام وتوزيع الجوائز",
      location: "Main Hall",
      locationAr: "القاعة الرئيسية",
      description: "Closing ceremony with appreciation and announcement of Best Project, Poster and Presentation Awards",
      descriptionAr: "حفل الختام مع التقدير والإعلان عن جوائز أفضل مشروع وملصق وعرض تقديمي"
    }
  ]
};

const getSessionIcon = (type: string) => {
  switch (type) {
    case "keynote":
      return <Presentation className="w-5 h-5" />;
    case "panel":
      return <MessageSquare className="w-5 h-5" />;
    case "break":
      return <Coffee className="w-5 h-5" />;
    case "closing":
      return <Award className="w-5 h-5" />;
    case "parallel":
      return <Users className="w-5 h-5" />;
    case "poster":
      return <Presentation className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const getSessionColor = (type: string) => {
  switch (type) {
    case "keynote":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "panel":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "break":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "closing":
      return "bg-green-100 text-green-700 border-green-200";
    case "parallel":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "poster":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "opening":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "registration":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState("day1");

  const currentSessions = selectedDay === "day1" ? sessions.day1 : sessions.day2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Conference Schedule</p>
              </div>
            </div>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="container">
          <div className="text-center space-y-4">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
              April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Conference Schedule</h1>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">جدول المؤتمر</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete program for both days including keynote speakers, parallel sessions, workshops, and awards ceremony
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" dir="rtl">
              البرنامج الكامل لليومين بما في ذلك المتحدثين الرئيسيين والجلسات المتوازية وورش العمل وحفل توزيع الجوائز
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="py-12">
        <div className="container">
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="day1" className="text-base">
                Day 1 - April 7 | ٧ أبريل
              </TabsTrigger>
              <TabsTrigger value="day2" className="text-base">
                Day 2 - April 8 | ٨ أبريل
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDay} className="space-y-6">
              {currentSessions.map((session: any) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getSessionColor(session.type)} border`}>
                            <span className="flex items-center gap-2">
                              {getSessionIcon(session.type)}
                              {session.time}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-sm" dir="rtl">
                            {session.timeAr}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{session.title}</CardTitle>
                        <CardDescription className="text-base font-medium" dir="rtl">
                          {session.titleAr}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.location && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{session.location}</p>
                          <p dir="rtl">{session.locationAr}</p>
                        </div>
                      </div>
                    )}
                    
                    {session.description && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                        <p className="text-sm text-muted-foreground" dir="rtl">{session.descriptionAr}</p>
                      </div>
                    )}

                    {/* Parallel Sessions */}
                    {session.tracks && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-primary">Conference Halls | القاعات:</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {session.tracks.map((track: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                              <p className="font-semibold text-sm text-primary">{track.hall}</p>
                              <p className="text-xs text-muted-foreground" dir="rtl">{track.hallAr}</p>
                              <p className="text-sm mt-2">{track.speaker}</p>
                              <p className="text-xs text-muted-foreground mt-1">{track.topic}</p>
                              <p className="text-xs text-muted-foreground" dir="rtl">{track.topicAr}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workshops */}
                    {session.workshops && (
                      <div className="space-y-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm font-semibold text-amber-900">Workshops | ورش العمل:</p>
                        {session.workshops.map((workshop: any, idx: number) => (
                          <div key={idx}>
                            <p className="text-sm font-medium text-amber-800">{workshop.room} - {workshop.name}</p>
                            <p className="text-xs text-amber-700" dir="rtl">{workshop.roomAr} - {workshop.nameAr}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Important Notes */}
          <Card className="mt-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Important Information | معلومات مهمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-primary mb-2">Conference Halls:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Hall A:</strong> Biological & Chemical Sciences (Connected to all halls for keynotes)</li>
                  <li><strong>Hall B:</strong> Mathematics, Physics, Geology, Astronomy & other sciences</li>
                  <li><strong>Hall C:</strong> Biological & Chemical Sciences (Participant presentations)</li>
                  <li><strong>Hall D:</strong> Mathematics, Physics, Geology, Astronomy & other sciences (Participant presentations)</li>
                </ul>
              </div>
              <div dir="rtl">
                <p className="font-semibold text-primary mb-2">القاعات:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>القاعة أ:</strong> العلوم البيولوجية والكيميائية (متصلة بجميع القاعات للعروض الرئيسية)</li>
                  <li><strong>القاعة ب:</strong> الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى</li>
                  <li><strong>القاعة ج:</strong> العلوم البيولوجية والكيميائية (عروض المشاركين)</li>
                  <li><strong>القاعة د:</strong> الرياضيات، الفيزياء، الجيولوجيا، الفلك والعلوم الأخرى (عروض المشاركين)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-primary mb-2">Workshops:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Day 1:</strong> MARC Workshop in Workshop Rooms 1 & 2</li>
                  <li><strong>Day 2:</strong> Nawah Workshop in Workshop Rooms 1 & 2</li>
                </ul>
              </div>
              <div dir="rtl">
                <p className="font-semibold text-primary mb-2">ورش العمل:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>اليوم الأول:</strong> ورشة عمل MARC في غرف ورشة العمل ١ و ٢</li>
                  <li><strong>اليوم الثاني:</strong> ورشة عمل نواة في غرف ورشة العمل ١ و ٢</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home Button */}
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/'}
              className="bg-primary hover:bg-primary/90"
            >
              Back to Home | العودة للرئيسية
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
