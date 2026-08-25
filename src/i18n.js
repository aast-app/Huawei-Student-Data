import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // General
      huawei_id: "Huawei ID",
      email: "Email Address",
      name: "Full Name",
      phone: "Phone Number",
      branch: "Branch",
      access_granted: "Access Granted!",
      welcome_back: "Welcome back",
      
      // Home Page
      access_courses: "Access Your",
      ict_courses: "ICT Courses",
      home_subtitle: "Join the official AAST-Huawei Academy gateway. Provide your details securely to unlock your dedicated branch materials and learning modules.",
      select_branch: "Select your branch",
      register: "Register Now",
      login_student: "Returning Student? Login",
      admin_access: "Admin Access",
      how_to_find_id: "How to find your Huawei ID?",
      
      // Modals
      admin_login: "Admin Dashboard",
      admin_password: "Admin Password",
      enter_dashboard: "Enter Dashboard",
      student_access: "Student Access",
      access_my_classes: "Access My Classes",
      id_help_title: "How to find your Huawei ID",
      click_image: "Click image to view full screen",
      got_it: "Got it",
      
      // Classes Page
      available_classes: "Available Classes",
      launch_course: "Launch Course",
      locked: "Locked",
      branch_label: "{{branch}} Branch",
      
      // Admin Page
      admin_title: "Admin Dashboard",
      showing_page: "Showing page",
      of: "of",
      total_students: "({{total}} total students)",
      export_csv: "Export CSV",
      logout: "Logout",
      search_id: "Search by ID...",
      search_name: "Search by Name...",
      all_branches: "All Branches",
      sort_newest: "Newest First",
      sort_oldest: "Oldest First",
      table_name: "Name",
      table_id: "Huawei ID",
      table_email: "Email",
      table_phone: "Phone",
      table_branch: "Branch",
      table_date: "Registration Date",
      no_students: "No students found matching your criteria."
    }
  },
  ar: {
    translation: {
      // General
      huawei_id: "رقم هواوي (Huawei ID)",
      email: "البريد الإلكتروني",
      name: "الاسم الرباعي",
      phone: "رقم الهاتف",
      branch: "الفرع",
      access_granted: "تم تسجيل الدخول بنجاح!",
      welcome_back: "أهلاً بك",
      
      // Home Page
      access_courses: "الوصول إلى",
      ict_courses: "كورسات هواوي",
      home_subtitle: "انضم إلى البوابة الرسمية لأكاديمية هواوي والأكاديمية العربية. أدخل بياناتك بأمان للوصول إلى المواد التعليمية الخاصة بفرعك.",
      select_branch: "اختر الفرع",
      register: "تسجيل جديد",
      login_student: "طالب مسجل مسبقاً؟ تسجيل الدخول",
      admin_access: "دخول الإدارة",
      how_to_find_id: "كيف أجد رقم هواوي الخاص بي؟",
      
      // Modals
      admin_login: "لوحة تحكم الإدارة",
      admin_password: "كلمة مرور الإدارة",
      enter_dashboard: "دخول للوحة التحكم",
      student_access: "دخول الطلاب",
      access_my_classes: "الوصول إلى الكورسات",
      id_help_title: "كيف تجد رقم هواوي الخاص بك",
      click_image: "اضغط على الصورة للتكبير",
      got_it: "حسناً، فهمت",
      
      // Classes Page
      available_classes: "الكورسات المتاحة",
      launch_course: "ابدأ الكورس",
      locked: "مغلق",
      branch_label: "فرع {{branch}}",
      
      // Admin Page
      admin_title: "لوحة تحكم الإدارة",
      showing_page: "عرض الصفحة",
      of: "من",
      total_students: "({{total}} إجمالي الطلاب)",
      export_csv: "تصدير CSV",
      logout: "تسجيل الخروج",
      search_id: "بحث برقم هواوي...",
      search_name: "بحث بالاسم...",
      all_branches: "جميع الفروع",
      sort_newest: "الأحدث أولاً",
      sort_oldest: "الأقدم أولاً",
      table_name: "الاسم",
      table_id: "رقم هواوي",
      table_email: "البريد الإلكتروني",
      table_phone: "رقم الهاتف",
      table_branch: "الفرع",
      table_date: "تاريخ التسجيل",
      no_students: "لا يوجد طلاب مطابقين لبحثك."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
