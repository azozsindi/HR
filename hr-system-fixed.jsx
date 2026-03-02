import { useState, useEffect, useRef } from "react";

// ─── Industries ────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { id: "general",      label: "عام",                labelEn: "General",            icon: "🏢", color: "#7B2FBE" },
  { id: "medical",      label: "طبي / صحي",           labelEn: "Medical / Healthcare",icon: "🏥", color: "#0077B6" },
  { id: "financial",    label: "مالي / محاسبي",       labelEn: "Financial",           icon: "💰", color: "#2A9D8F" },
  { id: "construction", label: "مقاولات / هندسة",     labelEn: "Construction",        icon: "🏗️", color: "#E76F51" },
  { id: "retail",       label: "تجزئة / مطاعم",       labelEn: "Retail / F&B",        icon: "🛒", color: "#E63946" },
  { id: "tech",         label: "تقنية / برمجة",       labelEn: "Tech / Software",     icon: "💻", color: "#457B9D" },
];


// Storage adapter for localStorage
const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      console.error('Storage set error:', e);
      return null;
    }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      console.error('Storage delete error:', e);
      return null;
    }
  }
};

const DEFAULT_COMPANY = {
  name: "شركة كير فور يو المحدودة",
  nameEn: "Care4u KSA Limited",
  logo: null,
  primaryColor: "#7B2FBE",
  industry: "general",
  address: "طريق الكورنيش الفرعي، الشاطئ، جدة 23511",
  addressEn: "Corniche Road, Al-Shati, Jeddah 23511",
  phone: "+966530785500",
  email: "info@care4uksa.com",
  website: "www.care4uksa.com",
  tagline: "FOR ALL YOUR SUPPORT NEEDS",
  stampMode: "manual",
  stampImage: null,
};

// ─── All Forms: industry = "general" means shown to all ───────────────────
const ALL_FORMS = [
  // ── Onboarding ──
  { id:"job_offer",    icon:"📨", title:"عرض وظيفي",             titleEn:"Job Offer",                   cat:"onboarding", industries:["general"] },
  { id:"contract",     icon:"📝", title:"عقد عمل",               titleEn:"Employment Contract",         cat:"onboarding", industries:["general"] },
  { id:"joining",      icon:"🚀", title:"نموذج مباشرة عمل",       titleEn:"Joining Report",              cat:"onboarding", industries:["general"] },
  { id:"nda",          icon:"🔒", title:"اتفاقية عدم إفصاح",     titleEn:"NDA",                         cat:"onboarding", industries:["general"] },
  { id:"asset_recv",   icon:"💼", title:"استلام عهدة",            titleEn:"Asset Handover",              cat:"onboarding", industries:["general"] },
  // ── Operations ──
  { id:"leave",        icon:"🏖️", title:"طلب إجازة",             titleEn:"Leave Request",               cat:"operations", industries:["general"] },
  { id:"salary_cert",  icon:"💰", title:"شهادة راتب",             titleEn:"Salary Certificate",         cat:"operations", industries:["general"] },
  { id:"intro_letter", icon:"📄", title:"خطاب تعريف",             titleEn:"Introduction Letter",        cat:"operations", industries:["general"] },
  { id:"advance",      icon:"💳", title:"طلب سلفة",               titleEn:"Salary Advance",             cat:"operations", industries:["general"] },
  { id:"timesheet",    icon:"🕐", title:"كشف وقت العمل",          titleEn:"Timesheet",                  cat:"operations", industries:["general"] },
  { id:"overtime",     icon:"⏰", title:"طلب عمل إضافي",          titleEn:"Overtime Request",           cat:"operations", industries:["general"] },
  { id:"biztrip",      icon:"✈️", title:"مهمة عمل / انتداب",     titleEn:"Business Trip",              cat:"operations", industries:["general"] },
  // ── Performance & Discipline ──
  { id:"performance",  icon:"📊", title:"تقييم أداء",             titleEn:"Performance Appraisal",      cat:"discipline", industries:["general"] },
  { id:"verbal_warn",  icon:"💬", title:"لفت نظر شفهي",           titleEn:"Verbal Warning",             cat:"discipline", industries:["general"] },
  { id:"warning",      icon:"⚠️", title:"إنذار كتابي",            titleEn:"Written Warning",            cat:"discipline", industries:["general"] },
  { id:"deduction",    icon:"✂️", title:"قرار خصم",               titleEn:"Deduction Order",            cat:"discipline", industries:["general"] },
  { id:"investigation",icon:"🔍", title:"محضر تحقيق إداري",       titleEn:"Investigation Record",       cat:"discipline", industries:["general"] },
  // ── Offboarding ──
  { id:"resignation",  icon:"🚪", title:"طلب استقالة",            titleEn:"Resignation",                cat:"offboarding",industries:["general"] },
  { id:"resign_accept",icon:"✉️", title:"قبول استقالة",           titleEn:"Resignation Acceptance",     cat:"offboarding",industries:["general"] },
  { id:"termination",  icon:"🔴", title:"إنهاء خدمات",            titleEn:"Termination Notice",         cat:"offboarding",industries:["general"] },
  { id:"clearance",    icon:"✅", title:"إخلاء طرف",               titleEn:"Clearance Form",             cat:"offboarding",industries:["general"] },
  { id:"final_settle", icon:"🧾", title:"مخالصة نهائية",           titleEn:"Final Settlement",          cat:"offboarding",industries:["general"] },
  { id:"experience",   icon:"🏅", title:"شهادة خبرة",              titleEn:"Experience Certificate",    cat:"offboarding",industries:["general"] },
  // ── Other general ──
  { id:"promotion",    icon:"⭐", title:"خطاب ترقية",              titleEn:"Promotion Letter",          cat:"operations", industries:["general"] },
  { id:"transfer",     icon:"🔄", title:"أمر نقل",                 titleEn:"Transfer Order",            cat:"operations", industries:["general"] },
  { id:"freeform",     icon:"✏️", title:"نموذج حر",                titleEn:"Free Form",                 cat:"operations", industries:["general"] },
  // ── Medical ──
  { id:"license_check",    icon:"🪪", title:"التحقق من صلاحية الترخيص",    titleEn:"License Validity Check",         cat:"medical", industries:["medical"] },
  { id:"patient_conf",     icon:"🤫", title:"سرية بيانات المرضى",          titleEn:"Patient Confidentiality",        cat:"medical", industries:["medical"] },
  { id:"shift_roster",     icon:"🗓️", title:"جدول المناوبات",              titleEn:"Shift Roster",                   cat:"medical", industries:["medical"] },
  { id:"incident_report",  icon:"🚨", title:"تقرير حادثة / خطأ طبي",      titleEn:"Incident Report",                cat:"medical", industries:["medical"] },
  { id:"infection_allow",  icon:"🧪", title:"نموذج بدل عدوى",              titleEn:"Infection Allowance",            cat:"medical", industries:["medical"] },
  // ── Financial ──
  { id:"fin_disclosure",   icon:"📋", title:"إقرار الذمة المالية",         titleEn:"Financial Disclosure",           cat:"financial", industries:["financial"] },
  { id:"cash_custody",     icon:"💵", title:"استلام عهدة نقدية",           titleEn:"Cash Custody Form",              cat:"financial", industries:["financial"] },
  { id:"aml_form",         icon:"🛡️", title:"إقرار مكافحة غسيل الأموال",  titleEn:"AML Compliance",                 cat:"financial", industries:["financial"] },
  { id:"cash_count",       icon:"🔢", title:"محضر جرد الصندوق",            titleEn:"Cash Count Record",              cat:"financial", industries:["financial"] },
  // ── Construction ──
  { id:"ppe_receipt",      icon:"🦺", title:"استلام مهمات السلامة (PPE)",  titleEn:"PPE Receipt",                    cat:"construction", industries:["construction"] },
  { id:"site_permit",      icon:"🚧", title:"تصريح دخول موقع",             titleEn:"Site Access Permit",             cat:"construction", industries:["construction"] },
  { id:"work_injury",      icon:"🩹", title:"نموذج إصابة عمل",             titleEn:"Work Injury Report",             cat:"construction", industries:["construction"] },
  { id:"site_transfer",    icon:"🔀", title:"نقل موظف بين المواقع",        titleEn:"Site Transfer Form",             cat:"construction", industries:["construction"] },
  // ── Retail ──
  { id:"uniform_recv",     icon:"👕", title:"استلام الزي الرسمي",          titleEn:"Uniform Receipt",                cat:"retail", industries:["retail"] },
  { id:"inventory_short",  icon:"📦", title:"إقرار عجز المخزون",           titleEn:"Inventory Shortage Ack.",        cat:"retail", industries:["retail"] },
  { id:"health_card",      icon:"🏥", title:"متابعة الفحص الصحي",          titleEn:"Health Card Tracker",            cat:"retail", industries:["retail"] },
  // ── Tech ──
  { id:"ip_assign",        icon:"©️",  title:"اتفاقية الملكية الفكرية",    titleEn:"IP Assignment",                  cat:"tech", industries:["tech"] },
  { id:"remote_policy",    icon:"🏠", title:"سياسة العمل عن بعد",          titleEn:"Remote Work Policy",             cat:"tech", industries:["tech"] },
  { id:"cyber_pledge",     icon:"🔐", title:"تعهد أمن المعلومات",          titleEn:"Cybersecurity Pledge",           cat:"tech", industries:["tech"] },
];

// ─── Form Fields ──────────────────────────────────────────────────────────
const FORM_FIELDS = {
  job_offer: { title:"عرض وظيفي", titleEn:"Job Offer", fields:[
    {key:"empName",    label:"اسم المرشح",          labelEn:"Candidate Name",    placeholder:"الاسم الكامل"},
    {key:"jobTitle",   label:"المسمى الوظيفي",       labelEn:"Job Title",         placeholder:"مثال: مدير مبيعات"},
    {key:"dept",       label:"القسم",               labelEn:"Department",        placeholder:"القسم"},
    {key:"salary",     label:"الراتب الأساسي (ريال)",labelEn:"Basic Salary (SAR)",placeholder:"0.00",type:"number"},
    {key:"allowances", label:"البدلات (ريال)",       labelEn:"Allowances (SAR)",  placeholder:"0.00",type:"number"},
    {key:"startDate",  label:"تاريخ بدء العمل",      labelEn:"Start Date",        type:"date"},
    {key:"offerExpiry",label:"صلاحية العرض حتى",    labelEn:"Offer Valid Until", type:"date"},
    {key:"probation",  label:"فترة الاختبار",        labelEn:"Probation",         type:"select",options:["90 يوم - 90 Days","180 يوم - 180 Days","لا توجد - None"]},
  ]},
  contract: { title:"عقد عمل", titleEn:"Employment Contract", fields:[
    {key:"empName",      label:"اسم الموظف",            labelEn:"Employee Name",     placeholder:"الاسم الكامل"},
    {key:"empId",        label:"رقم الهوية / الإقامة",  labelEn:"ID / Iqama No.",    placeholder:"1234567890"},
    {key:"nationality",  label:"الجنسية",               labelEn:"Nationality",       placeholder:"سعودي"},
    {key:"jobTitle",     label:"المسمى الوظيفي",        labelEn:"Job Title",         placeholder:"مثال: مهندس"},
    {key:"dept",         label:"القسم",                 labelEn:"Department",        placeholder:"القسم"},
    {key:"startDate",    label:"تاريخ بدء العمل",       labelEn:"Start Date",        type:"date"},
    {key:"contractType", label:"نوع العقد",             labelEn:"Contract Type",     type:"select",options:["محدد المدة - Fixed Term","غير محدد المدة - Open-Ended"]},
    {key:"endDate",      label:"تاريخ انتهاء العقد",   labelEn:"End Date",          type:"date"},
    {key:"salary",       label:"الراتب الأساسي (ريال)", labelEn:"Basic Salary (SAR)",placeholder:"0.00",type:"number"},
    {key:"allowances",   label:"البدلات (ريال)",        labelEn:"Allowances (SAR)",  placeholder:"0.00",type:"number"},
    {key:"workHours",    label:"ساعات العمل اليومية",   labelEn:"Daily Work Hours",  placeholder:"8",type:"number"},
    {key:"probation",    label:"فترة الاختبار",         labelEn:"Probation",         type:"select",options:["90 يوم - 90 Days","180 يوم - 180 Days","لا توجد - None"]},
  ]},
  joining: { title:"نموذج مباشرة عمل", titleEn:"Joining Report", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dept",      label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"joinDate",  label:"تاريخ المباشرة",      labelEn:"Joining Date",   type:"date"},
    {key:"manager",   label:"المدير المباشر",       labelEn:"Line Manager",   placeholder:"اسم المدير"},
  ]},
  nda: { title:"اتفاقية عدم إفصاح", titleEn:"Non-Disclosure Agreement", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"signDate", label:"تاريخ التوقيع",       labelEn:"Sign Date",      type:"date"},
  ]},
  asset_recv: { title:"نموذج استلام عهدة", titleEn:"Asset Handover Form", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"items",    label:"قائمة العهد (كل بند في سطر)",labelEn:"Assets List",placeholder:"مثال:\nلابتوب - HP ProBook SN: 12345\nجوال - iPhone 13 SN: 67890\nمفاتيح مكتب رقم 204",type:"textarea",rows:6},
    {key:"recvDate", label:"تاريخ الاستلام",      labelEn:"Received Date",  type:"date"},
  ]},
  leave: { title:"طلب إجازة", titleEn:"Leave Request", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",      label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"leaveType", label:"نوع الإجازة",         labelEn:"Leave Type",     type:"select",options:["إجازة سنوية - Annual","إجازة مرضية - Sick","إجازة أمومة - Maternity","إجازة زواج - Marriage","إجازة وفاة - Bereavement","إجازة حج - Hajj","إجازة طارئة - Emergency","إجازة بدون راتب - Unpaid"]},
    {key:"dateFrom",  label:"من تاريخ",            labelEn:"From Date",      type:"date"},
    {key:"dateTo",    label:"إلى تاريخ",           labelEn:"To Date",        type:"date"},
    {key:"days",      label:"عدد الأيام",          labelEn:"No. of Days",    placeholder:"0",type:"number"},
    {key:"reason",    label:"السبب",               labelEn:"Reason",         placeholder:"سبب الإجازة",type:"textarea"},
  ]},
  salary_cert: { title:"شهادة راتب", titleEn:"Salary Certificate", fields:[
    {key:"empName",     label:"اسم الموظف",          labelEn:"Employee Name",    placeholder:"الاسم الكامل"},
    {key:"empId",       label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",   placeholder:"1234567890"},
    {key:"jobTitle",    label:"المسمى الوظيفي",      labelEn:"Job Title",        placeholder:"المسمى"},
    {key:"dept",        label:"القسم",               labelEn:"Department",       placeholder:"القسم"},
    {key:"salary",      label:"الراتب الأساسي (ريال)",labelEn:"Basic Salary",    placeholder:"0.00",type:"number"},
    {key:"allowances",  label:"البدلات (ريال)",       labelEn:"Allowances",       placeholder:"0.00",type:"number"},
    {key:"totalSalary", label:"الإجمالي (ريال)",      labelEn:"Total",            placeholder:"0.00",type:"number"},
    {key:"hireDate",    label:"تاريخ الالتحاق",      labelEn:"Hire Date",        type:"date"},
    {key:"issuedFor",   label:"صادرة لجهة",          labelEn:"Issued To",        placeholder:"البنك الأهلي"},
  ]},
  intro_letter: { title:"خطاب تعريف", titleEn:"Introduction Letter", fields:[
    {key:"empName",    label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"nationality",label:"الجنسية",             labelEn:"Nationality",    placeholder:"سعودي"},
    {key:"jobTitle",   label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",       label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"hireDate",   label:"تاريخ الالتحاق",      labelEn:"Hire Date",      type:"date"},
    {key:"issuedFor",  label:"تقديم إلى",           labelEn:"Issued To",      placeholder:"الجهة المستلمة"},
  ]},
  advance: { title:"طلب سلفة", titleEn:"Salary Advance", fields:[
    {key:"empName", label:"اسم الموظف",          labelEn:"Employee Name",      placeholder:"الاسم الكامل"},
    {key:"empId",   label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",     placeholder:"1234567890"},
    {key:"jobTitle",label:"المسمى الوظيفي",      labelEn:"Job Title",          placeholder:"المسمى"},
    {key:"salary",  label:"الراتب الأساسي (ريال)",labelEn:"Basic Salary (SAR)",placeholder:"0.00",type:"number"},
    {key:"amount",  label:"مبلغ السلفة (ريال)",   labelEn:"Advance (SAR)",     placeholder:"0.00",type:"number"},
    {key:"months",  label:"أشهر الاستقطاع",      labelEn:"Deduction Months",  placeholder:"3",type:"number"},
    {key:"reason",  label:"السبب",               labelEn:"Reason",            placeholder:"سبب الطلب",type:"textarea"},
    {key:"date",    label:"التاريخ",             labelEn:"Date",              type:"date"},
  ]},
  timesheet: { title:"كشف وقت العمل", titleEn:"Timesheet", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"month",    label:"الشهر / Month",       labelEn:"Month",          placeholder:"مثال: يناير 2025"},
    {key:"totalDays",label:"إجمالي أيام العمل",   labelEn:"Total Work Days",placeholder:"0",type:"number"},
    {key:"otHours",  label:"ساعات إضافية",        labelEn:"Overtime Hours", placeholder:"0",type:"number"},
    {key:"absences", label:"أيام الغياب",         labelEn:"Absent Days",    placeholder:"0",type:"number"},
    {key:"notes",    label:"ملاحظات",             labelEn:"Notes",          placeholder:"أي ملاحظات",type:"textarea"},
  ]},
  overtime: { title:"طلب عمل إضافي", titleEn:"Overtime Request", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",      label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"otDate",    label:"التاريخ",             labelEn:"Date",           type:"date"},
    {key:"startTime", label:"وقت البدء",           labelEn:"Start Time",     placeholder:"17:00"},
    {key:"endTime",   label:"وقت الانتهاء",        labelEn:"End Time",       placeholder:"21:00"},
    {key:"hours",     label:"عدد الساعات",         labelEn:"Total Hours",    placeholder:"4",type:"number"},
    {key:"reason",    label:"السبب",               labelEn:"Reason",         placeholder:"سبب العمل الإضافي",type:"textarea"},
  ]},
  biztrip: { title:"مهمة عمل / انتداب", titleEn:"Business Trip", fields:[
    {key:"empName",  label:"اسم الموظف",           labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة", labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",       labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dest",     label:"وجهة المهمة",          labelEn:"Destination",     placeholder:"مثال: الرياض"},
    {key:"purpose",  label:"الغرض من المهمة",      labelEn:"Purpose",         placeholder:"وصف المهمة",type:"textarea"},
    {key:"dateFrom", label:"من تاريخ",             labelEn:"From Date",       type:"date"},
    {key:"dateTo",   label:"إلى تاريخ",            labelEn:"To Date",         type:"date"},
    {key:"allowance",label:"بدل الانتداب (ريال)",  labelEn:"Trip Allowance",  placeholder:"0.00",type:"number"},
  ]},
  performance: { title:"تقييم أداء", titleEn:"Performance Appraisal", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"period",   label:"فترة التقييم",        labelEn:"Review Period",  placeholder:"الربع الأول 2025"},
    {key:"score1",   label:"الأداء الوظيفي (/10)", labelEn:"Job Performance /10",placeholder:"8",type:"number"},
    {key:"score2",   label:"الالتزام (/10)",       labelEn:"Commitment /10", placeholder:"8",type:"number"},
    {key:"score3",   label:"العمل الجماعي (/10)",  labelEn:"Teamwork /10",   placeholder:"8",type:"number"},
    {key:"score4",   label:"المبادرة (/10)",        labelEn:"Initiative /10", placeholder:"8",type:"number"},
    {key:"comments", label:"ملاحظات المقيّم",      labelEn:"Reviewer Notes", placeholder:"ملاحظاتك",type:"textarea"},
  ]},
  verbal_warn: { title:"لفت نظر شفهي", titleEn:"Verbal Warning Record", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",      label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"violation", label:"السلوك المخالف",      labelEn:"Violation",      placeholder:"وصف المخالفة",type:"textarea"},
    {key:"date",      label:"التاريخ",             labelEn:"Date",           type:"date"},
    {key:"manager",   label:"اسم المدير",          labelEn:"Manager Name",   placeholder:"اسم المدير"},
  ]},
  warning: { title:"خطاب إنذار", titleEn:"Written Warning", fields:[
    {key:"empName",     label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",       label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",    label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",        label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"warningType", label:"نوع الإنذار",         labelEn:"Warning Level",  type:"select",options:["إنذار أول - 1st Warning","إنذار ثانٍ - 2nd Warning","إنذار أخير - Final Warning"]},
    {key:"violation",   label:"المخالفة",            labelEn:"Violation",      placeholder:"وصف المخالفة",type:"textarea"},
    {key:"date",        label:"التاريخ",             labelEn:"Date",           type:"date"},
  ]},
  deduction: { title:"قرار خصم", titleEn:"Deduction Order", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",      placeholder:"القسم"},
    {key:"reason",   label:"سبب الخصم",           labelEn:"Reason",          placeholder:"مثال: غياب بدون إذن",type:"textarea"},
    {key:"days",     label:"عدد أيام الخصم",      labelEn:"Days Deducted",   placeholder:"2",type:"number"},
    {key:"amount",   label:"المبلغ المخصوم (ريال)",labelEn:"Amount (SAR)",   placeholder:"0.00",type:"number"},
    {key:"date",     label:"التاريخ",             labelEn:"Date",            type:"date"},
  ]},
  investigation: { title:"محضر تحقيق إداري", titleEn:"Investigation Record", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dept",      label:"القسم",               labelEn:"Department",      placeholder:"القسم"},
    {key:"incident",  label:"وصف الحادثة / المخالفة",labelEn:"Incident",     placeholder:"تفاصيل الحادثة",type:"textarea"},
    {key:"empReply",  label:"رد الموظف / أقواله",  labelEn:"Employee Statement",placeholder:"أقوال الموظف",type:"textarea"},
    {key:"decision",  label:"قرار لجنة التحقيق",   labelEn:"Committee Decision",placeholder:"القرار النهائي",type:"textarea"},
    {key:"date",      label:"التاريخ",             labelEn:"Date",            type:"date"},
  ]},
  resignation: { title:"طلب استقالة", titleEn:"Resignation Letter", fields:[
    {key:"empName",    label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle",   label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dept",       label:"القسم",               labelEn:"Department",      placeholder:"القسم"},
    {key:"hireDate",   label:"تاريخ الالتحاق",      labelEn:"Hire Date",       type:"date"},
    {key:"resignDate", label:"تاريخ الاستقالة",     labelEn:"Resignation Date",type:"date"},
    {key:"lastDay",    label:"آخر يوم عمل",         labelEn:"Last Working Day",type:"date"},
    {key:"reason",     label:"السبب",               labelEn:"Reason",          placeholder:"سبب الاستقالة",type:"textarea"},
  ]},
  resign_accept: { title:"قبول استقالة", titleEn:"Resignation Acceptance", fields:[
    {key:"empName",    label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle",   label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dept",       label:"القسم",               labelEn:"Department",      placeholder:"القسم"},
    {key:"resignDate", label:"تاريخ تقديم الاستقالة",labelEn:"Resignation Date",type:"date"},
    {key:"lastDay",    label:"آخر يوم عمل محدد",    labelEn:"Last Working Day",type:"date"},
  ]},
  termination: { title:"إنهاء خدمات", titleEn:"Termination Notice", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",      placeholder:"القسم"},
    {key:"hireDate", label:"تاريخ الالتحاق",      labelEn:"Hire Date",       type:"date"},
    {key:"termDate", label:"تاريخ إنهاء الخدمة", labelEn:"Termination Date",type:"date"},
    {key:"reason",   label:"سبب الإنهاء",         labelEn:"Reason",          placeholder:"سبب الإنهاء",type:"textarea"},
  ]},
  clearance: { title:"إخلاء طرف", titleEn:"Clearance Form", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",    placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",   placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",        placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",       placeholder:"القسم"},
    {key:"lastDay",  label:"آخر يوم عمل",         labelEn:"Last Working Day", type:"date"},
  ]},
  final_settle: { title:"مخالصة نهائية", titleEn:"Final Settlement", fields:[
    {key:"empName",      label:"اسم الموظف",            labelEn:"Employee Name",      placeholder:"الاسم الكامل"},
    {key:"empId",        label:"رقم الهوية / الإقامة",  labelEn:"ID / Iqama No.",     placeholder:"1234567890"},
    {key:"jobTitle",     label:"المسمى الوظيفي",        labelEn:"Job Title",          placeholder:"المسمى"},
    {key:"dept",         label:"القسم",                 labelEn:"Department",         placeholder:"القسم"},
    {key:"hireDate",     label:"تاريخ الالتحاق",        labelEn:"Hire Date",          type:"date"},
    {key:"lastDay",      label:"آخر يوم عمل",           labelEn:"Last Working Day",   type:"date"},
    {key:"eosb",         label:"مكافأة نهاية الخدمة",   labelEn:"EOSB (SAR)",         placeholder:"0.00",type:"number"},
    {key:"leaveBalance", label:"رصيد الإجازات (أيام)",   labelEn:"Leave Balance (days)",placeholder:"0",type:"number"},
    {key:"leaveAmount",  label:"قيمة الإجازات (ريال)",   labelEn:"Leave Encashment",   placeholder:"0.00",type:"number"},
    {key:"deductions",   label:"الخصومات (ريال)",        labelEn:"Deductions",         placeholder:"0.00",type:"number"},
    {key:"totalAmount",  label:"الإجمالي المستحق (ريال)", labelEn:"Total Dues (SAR)",  placeholder:"0.00",type:"number"},
  ]},
  experience: { title:"شهادة خبرة", titleEn:"Experience Certificate", fields:[
    {key:"empName",    label:"اسم الموظف",          labelEn:"Employee Name",    placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",   placeholder:"1234567890"},
    {key:"nationality",label:"الجنسية",             labelEn:"Nationality",      placeholder:"سعودي"},
    {key:"jobTitle",   label:"المسمى الوظيفي",      labelEn:"Job Title",        placeholder:"المسمى"},
    {key:"dept",       label:"القسم",               labelEn:"Department",       placeholder:"القسم"},
    {key:"hireDate",   label:"تاريخ الالتحاق",      labelEn:"Hire Date",        type:"date"},
    {key:"lastDay",    label:"آخر يوم عمل",         labelEn:"Last Working Day", type:"date"},
    {key:"conduct",    label:"السلوك والأخلاق",      labelEn:"Conduct",          type:"select",options:["ممتاز - Excellent","جيد جداً - Very Good","جيد - Good"]},
  ]},
  promotion: { title:"خطاب ترقية", titleEn:"Promotion Letter", fields:[
    {key:"empName",  label:"اسم الموظف",            labelEn:"Employee Name",      placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",  labelEn:"ID / Iqama No.",     placeholder:"1234567890"},
    {key:"oldTitle", label:"المسمى الحالي",          labelEn:"Current Title",      placeholder:"المسمى الحالي"},
    {key:"newTitle", label:"المسمى الجديد",          labelEn:"New Title",          placeholder:"المسمى الجديد"},
    {key:"dept",     label:"القسم",                 labelEn:"Department",         placeholder:"القسم"},
    {key:"oldSalary",label:"الراتب الحالي (ريال)",   labelEn:"Current Salary",     placeholder:"0.00",type:"number"},
    {key:"newSalary",label:"الراتب الجديد (ريال)",   labelEn:"New Salary",         placeholder:"0.00",type:"number"},
    {key:"effDate",  label:"تاريخ السريان",          labelEn:"Effective Date",     type:"date"},
  ]},
  transfer: { title:"أمر نقل", titleEn:"Transfer Order", fields:[
    {key:"empName", label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",   label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"fromDept",label:"من قسم / فرع",        labelEn:"From",            placeholder:"القسم الحالي"},
    {key:"toDept",  label:"إلى قسم / فرع",       labelEn:"To",              placeholder:"القسم الجديد"},
    {key:"effDate", label:"تاريخ السريان",        labelEn:"Effective Date",  type:"date"},
    {key:"reason",  label:"السبب",               labelEn:"Reason",          placeholder:"سبب النقل",type:"textarea"},
  ]},
  freeform: { title:"نموذج حر", titleEn:"Free Form", fields:[
    {key:"subject",   label:"الموضوع",     labelEn:"Subject",    placeholder:"عنوان الخطاب أو الوثيقة"},
    {key:"recipient", label:"المرسل إليه", labelEn:"To",         placeholder:"اسم الجهة أو الشخص"},
    {key:"body",      label:"النص",        labelEn:"Body",       placeholder:"اكتب محتوى الخطاب هنا بحرية تامة...",type:"textarea",rows:14},
    {key:"signedBy",  label:"اسم الموقّع", labelEn:"Signed By",  placeholder:"الاسم والمنصب"},
  ]},
  // ── Medical ──
  license_check: { title:"التحقق من صلاحية الترخيص", titleEn:"License Validity Check", fields:[
    {key:"empName",      label:"اسم الموظف",            labelEn:"Employee Name",      placeholder:"الاسم الكامل"},
    {key:"empId",        label:"رقم الهوية / الإقامة",  labelEn:"ID / Iqama No.",     placeholder:"1234567890"},
    {key:"jobTitle",     label:"التخصص / المسمى",       labelEn:"Specialty / Title",  placeholder:"مثال: طبيب عام"},
    {key:"licenseNo",    label:"رقم الترخيص",           labelEn:"License No.",        placeholder:"رقم هيئة التخصصات"},
    {key:"licenseExpiry",label:"تاريخ انتهاء الترخيص",  labelEn:"License Expiry",     type:"date"},
    {key:"status",       label:"الحالة",                labelEn:"Status",             type:"select",options:["ساري - Valid","منتهي - Expired","قيد التجديد - Renewal Pending"]},
    {key:"notes",        label:"ملاحظات",               labelEn:"Notes",             placeholder:"ملاحظات",type:"textarea"},
  ]},
  patient_conf: { title:"سرية بيانات المرضى", titleEn:"Patient Confidentiality Agreement", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"signDate", label:"تاريخ التوقيع",       labelEn:"Sign Date",      type:"date"},
  ]},
  shift_roster: { title:"جدول المناوبات", titleEn:"Shift Roster", fields:[
    {key:"empName",    label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",   label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",       label:"القسم / الجناح",       labelEn:"Ward / Dept.",   placeholder:"مثال: طوارئ"},
    {key:"month",      label:"الشهر",               labelEn:"Month",          placeholder:"مثال: يناير 2025"},
    {key:"shiftType",  label:"نوع الوردية الأساسي",  labelEn:"Shift Type",     type:"select",options:["صباحي - Morning","مسائي - Evening","ليلي - Night","مختلط - Mixed"]},
    {key:"schedule",   label:"تفاصيل الجدول",       labelEn:"Schedule Details",placeholder:"مثال:\nالأحد: صباحي 7-15\nالاثنين: ليلي 23-7...",type:"textarea",rows:6},
  ]},
  incident_report: { title:"تقرير حادثة / خطأ طبي", titleEn:"Incident Report", fields:[
    {key:"empName",    label:"اسم الموظف المُبلِّغ", labelEn:"Reported By",     placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة", labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"dept",       label:"القسم / الجناح",       labelEn:"Ward / Dept.",    placeholder:"مثال: طوارئ"},
    {key:"incidentDate",label:"تاريخ الحادثة",       labelEn:"Incident Date",   type:"date"},
    {key:"incidentType",label:"نوع الحادثة",         labelEn:"Incident Type",   type:"select",options:["خطأ طبي - Medical Error","سقوط مريض - Patient Fall","عدوى - Infection","حادث دواء - Medication Error","أخرى - Other"]},
    {key:"description",label:"وصف الحادثة",         labelEn:"Description",     placeholder:"تفاصيل كاملة عن الحادثة",type:"textarea"},
    {key:"action",     label:"الإجراء المتخذ",       labelEn:"Action Taken",    placeholder:"ما الذي تم فعله؟",type:"textarea"},
  ]},
  infection_allow: { title:"نموذج بدل عدوى", titleEn:"Infection Allowance Form", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",     placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",    placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",         placeholder:"المسمى"},
    {key:"dept",      label:"القسم",               labelEn:"Department",        placeholder:"القسم"},
    {key:"month",     label:"الشهر",               labelEn:"Month",             placeholder:"مثال: يناير 2025"},
    {key:"amount",    label:"مبلغ البدل (ريال)",    labelEn:"Allowance (SAR)",   placeholder:"0.00",type:"number"},
  ]},
  // ── Financial ──
  fin_disclosure: { title:"إقرار الذمة المالية", titleEn:"Financial Disclosure", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"conflicts", label:"هل لديك تعارض مصالح؟",labelEn:"Any Conflicts?",  type:"select",options:["لا - No","نعم - Yes (يرجى التفصيل أدناه)"]},
    {key:"details",   label:"التفاصيل (إن وجدت)",  labelEn:"Details",         placeholder:"اذكر أي علاقات أو مصالح مالية",type:"textarea"},
    {key:"signDate",  label:"تاريخ التوقيع",       labelEn:"Sign Date",       type:"date"},
  ]},
  cash_custody: { title:"استلام عهدة نقدية", titleEn:"Cash Custody Form", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"amount",   label:"مبلغ العهدة النقدية (ريال)",labelEn:"Cash Amount (SAR)",placeholder:"0.00",type:"number"},
    {key:"purpose",  label:"الغرض",               labelEn:"Purpose",        placeholder:"مثال: صندوق نثريات"},
    {key:"date",     label:"تاريخ الاستلام",       labelEn:"Received Date",  type:"date"},
  ]},
  aml_form: { title:"إقرار مكافحة غسيل الأموال", titleEn:"AML Compliance Form", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"signDate", label:"تاريخ التوقيع",       labelEn:"Sign Date",      type:"date"},
  ]},
  cash_count: { title:"محضر جرد الصندوق", titleEn:"Cash Count Record", fields:[
    {key:"empName",   label:"اسم المسؤول",         labelEn:"Cashier Name",    placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية",          labelEn:"ID No.",          placeholder:"1234567890"},
    {key:"date",      label:"تاريخ الجرد",         labelEn:"Count Date",      type:"date"},
    {key:"systemBal", label:"الرصيد حسب النظام (ريال)",labelEn:"System Balance",placeholder:"0.00",type:"number"},
    {key:"actualBal", label:"الرصيد الفعلي (ريال)", labelEn:"Actual Balance",  placeholder:"0.00",type:"number"},
    {key:"diff",      label:"الفرق (ريال)",         labelEn:"Difference",      placeholder:"0.00",type:"number"},
    {key:"notes",     label:"ملاحظات",             labelEn:"Notes",           placeholder:"تفسير الفرق إن وجد",type:"textarea"},
  ]},
  // ── Construction ──
  ppe_receipt: { title:"استلام مهمات السلامة", titleEn:"PPE Receipt", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"site",     label:"اسم الموقع / المشروع", labelEn:"Site / Project", placeholder:"مثال: برج الرياض B2"},
    {key:"items",    label:"قائمة مهمات السلامة",  labelEn:"PPE Items",      placeholder:"مثال:\nخوذة صفراء - Helmet\nحذاء سلامة - Safety Boots\nسترة عاكسة - Vest",type:"textarea",rows:5},
    {key:"date",     label:"تاريخ الاستلام",       labelEn:"Received Date",  type:"date"},
  ]},
  site_permit: { title:"تصريح دخول موقع", titleEn:"Site Access Permit", fields:[
    {key:"empName",  label:"اسم الموظف",           labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة", labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",       labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"site",     label:"اسم الموقع",           labelEn:"Site Name",      placeholder:"مثال: موقع A - جدة"},
    {key:"purpose",  label:"الغرض من الزيارة",     labelEn:"Purpose",        placeholder:"سبب الدخول"},
    {key:"dateFrom", label:"من تاريخ",             labelEn:"From",           type:"date"},
    {key:"dateTo",   label:"إلى تاريخ",            labelEn:"To",             type:"date"},
  ]},
  work_injury: { title:"نموذج إصابة عمل", titleEn:"Work Injury Report", fields:[
    {key:"empName",     label:"اسم الموظف",           labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",       label:"رقم الهوية / الإقامة", labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle",    label:"المسمى الوظيفي",       labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"site",        label:"موقع الحادثة",         labelEn:"Incident Site",   placeholder:"مثال: الطابق الثالث"},
    {key:"injuryDate",  label:"تاريخ الإصابة",       labelEn:"Injury Date",     type:"date"},
    {key:"injuryType",  label:"نوع الإصابة",         labelEn:"Injury Type",     placeholder:"مثال: كسر في اليد اليمنى"},
    {key:"description", label:"وصف الحادثة",         labelEn:"Description",     placeholder:"تفاصيل كيفية وقوع الحادثة",type:"textarea"},
    {key:"witnesses",   label:"الشهود",              labelEn:"Witnesses",       placeholder:"أسماء الشهود"},
  ]},
  site_transfer: { title:"نقل موظف بين المواقع", titleEn:"Site Transfer Form", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"fromSite", label:"من موقع / مشروع",     labelEn:"From Site",      placeholder:"الموقع الحالي"},
    {key:"toSite",   label:"إلى موقع / مشروع",    labelEn:"To Site",        placeholder:"الموقع الجديد"},
    {key:"effDate",  label:"تاريخ السريان",        labelEn:"Effective Date", type:"date"},
    {key:"reason",   label:"السبب",               labelEn:"Reason",         placeholder:"سبب النقل",type:"textarea"},
  ]},
  // ── Retail ──
  uniform_recv: { title:"استلام الزي الرسمي", titleEn:"Uniform Receipt", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"branch",   label:"الفرع",               labelEn:"Branch",          placeholder:"اسم الفرع"},
    {key:"items",    label:"قطع الزي المستلمة",   labelEn:"Uniform Items",   placeholder:"مثال:\n3 قمصان - Shirts (L)\n2 بنطال - Trousers (32)\n1 كاب - Cap",type:"textarea",rows:4},
    {key:"date",     label:"تاريخ الاستلام",       labelEn:"Received Date",  type:"date"},
  ]},
  inventory_short: { title:"إقرار عجز المخزون", titleEn:"Inventory Shortage", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"branch",    label:"الفرع",               labelEn:"Branch",          placeholder:"اسم الفرع"},
    {key:"items",     label:"المواد الناقصة",       labelEn:"Missing Items",   placeholder:"تفاصيل المخزون الناقص",type:"textarea",rows:4},
    {key:"amount",    label:"القيمة التقديرية (ريال)",labelEn:"Estimated Value",placeholder:"0.00",type:"number"},
    {key:"date",      label:"تاريخ الاكتشاف",      labelEn:"Discovery Date",  type:"date"},
  ]},
  health_card: { title:"متابعة الفحص الصحي", titleEn:"Health Card Tracker", fields:[
    {key:"empName",    label:"اسم الموظف",            labelEn:"Employee Name",   placeholder:"الاسم الكامل"},
    {key:"empId",      label:"رقم الهوية / الإقامة",  labelEn:"ID / Iqama No.",  placeholder:"1234567890"},
    {key:"jobTitle",   label:"المسمى الوظيفي",        labelEn:"Job Title",       placeholder:"المسمى"},
    {key:"branch",     label:"الفرع",                 labelEn:"Branch",          placeholder:"اسم الفرع"},
    {key:"cardExpiry", label:"تاريخ انتهاء الشهادة الصحية",labelEn:"Health Card Expiry",type:"date"},
    {key:"status",     label:"الحالة",                labelEn:"Status",          type:"select",options:["سارية - Valid","منتهية - Expired","قيد التجديد - Renewal Pending"]},
  ]},
  // ── Tech ──
  ip_assign: { title:"اتفاقية الملكية الفكرية", titleEn:"IP Assignment Agreement", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"مثال: مطور برمجيات"},
    {key:"dept",     label:"القسم",               labelEn:"Department",     placeholder:"مثال: هندسة البرمجيات"},
    {key:"signDate", label:"تاريخ التوقيع",       labelEn:"Sign Date",      type:"date"},
  ]},
  remote_policy: { title:"سياسة العمل عن بعد", titleEn:"Remote Work Policy", fields:[
    {key:"empName",   label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",     label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle",  label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"workDays",  label:"أيام العمل عن بعد",   labelEn:"Remote Days",    type:"select",options:["يومان في الأسبوع - 2 days/week","3 أيام - 3 days/week","بالكامل عن بعد - Full Remote","حسب الحاجة - As Needed"]},
    {key:"hours",     label:"ساعات العمل المحددة",  labelEn:"Work Hours",     placeholder:"مثال: 9 صباحاً - 6 مساءً"},
    {key:"signDate",  label:"تاريخ التوقيع",       labelEn:"Sign Date",      type:"date"},
  ]},
  cyber_pledge: { title:"تعهد أمن المعلومات", titleEn:"Cybersecurity Pledge", fields:[
    {key:"empName",  label:"اسم الموظف",          labelEn:"Employee Name",  placeholder:"الاسم الكامل"},
    {key:"empId",    label:"رقم الهوية / الإقامة",labelEn:"ID / Iqama No.", placeholder:"1234567890"},
    {key:"jobTitle", label:"المسمى الوظيفي",      labelEn:"Job Title",      placeholder:"المسمى"},
    {key:"dept",     label:"القسم",               labelEn:"Department",     placeholder:"القسم"},
    {key:"signDate", label:"تاريخ التوقيع",       labelEn:"Sign Date",      type:"date"},
  ]},
};

// ─── Print helper ─────────────────────────────────────────────────────────
function printHtml(html) {
  const css = [
    "* { box-sizing: border-box; margin: 0; padding: 0; }",
    "body { font-family: 'Segoe UI',Tahoma,Arial,sans-serif; direction: rtl; font-size: 11pt; color: #222; padding: 14mm; }",
    "table { border-collapse: collapse; width: 100%; margin-bottom: 14px; }",
    "th, td { border: 1px solid #ddd; padding: 6px 10px; }",
    "img { max-width: 100%; }",
    "@media print { body { padding: 10mm; } }"
  ].join("\n");

  const scriptContent = "window.onload=function(){window.print();}";
  const scriptTag = "<scr" + "ipt>" + scriptContent + "<\/scr" + "ipt>";

  const fullPage = [
    "<!DOCTYPE html><html><head><meta charset='utf-8'>",
    "<style>", css, "</style>",
    "</head><body>",
    html,
    scriptTag,
    "</body></html>"
  ].join("\n");

  try {
    const blob = new Blob([fullPage], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    if (!win) throw new Error("blocked");
  } catch(e) {
    // Fallback: write to a new window directly
    try {
      const win2 = window.open("", "_blank");
      if (win2) {
        win2.document.open();
        win2.document.write(fullPage);
        win2.document.close();
        setTimeout(() => { try { win2.print(); } catch(_) {} }, 500);
      }
    } catch(_) {}
  }
}

// ─── Document Builder ──────────────────────────────────────────────────────
function buildDoc(formId, data, company) {
  const today = new Date();
  const tAr = today.toLocaleDateString("ar-SA-u-ca-gregory",{year:"numeric",month:"long",day:"numeric"});
  const tEn = today.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const c = company.primaryColor;

  const logoHtml = company.logo
    ? `<img src="${company.logo}" style="height:54px;object-fit:contain;" />`
    : `<div style="font-size:19px;font-weight:900;color:${c};">${company.nameEn||company.name}</div>`;

  const hdr = `<div style="direction:rtl;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:3px solid ${c};margin-bottom:18px;">
      <div>${logoHtml}<div style="font-size:9px;color:#999;letter-spacing:1px;margin-top:2px;">${company.tagline||""}</div></div>
      <div style="text-align:left;font-size:10px;color:#555;line-height:1.9;">
        <div>${company.address}${company.addressEn?" | "+company.addressEn:""}</div>
        <div>${company.phone} | ${company.email} | ${company.website}</div>
      </div>
    </div>`;
  const ftr = `<div style="margin-top:36px;padding-top:8px;border-top:2px solid ${c};display:flex;justify-content:space-between;font-size:9px;color:#aaa;">
    <span>${company.name} | ${company.nameEn||""}</span><span>${company.website}</span><span>${company.phone}</span>
  </div></div>`;

  const row = (ar, en, v) => v
    ? `<tr><td style="padding:6px 10px;font-weight:700;color:#333;background:#f7f7f9;width:30%;font-size:11px;">${ar}<br><span style="font-size:9px;color:#aaa;font-weight:400;">${en}</span></td><td style="padding:6px 10px;font-size:12px;">${v}</td></tr>` : "";
  const tbl = r => `<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">${r}</table>`;
  const h = (ar, en) => `<div style="text-align:center;margin-bottom:18px;">
    <div style="font-size:17px;font-weight:900;color:${c};border:2px solid ${c};display:inline-block;padding:6px 26px;border-radius:4px;">${ar} | ${en}</div>
    <div style="font-size:10px;color:#aaa;margin-top:4px;">${tAr} | ${tEn}</div></div>`;
  const box = (ar, en, txt) => txt ? `<div style="margin-bottom:14px;"><div style="font-weight:700;color:#444;margin-bottom:4px;font-size:11px;">${ar} / ${en}:</div><div style="border:1px solid #eee;padding:10px;background:#fafafa;border-radius:4px;font-size:12px;line-height:1.7;white-space:pre-wrap;">${txt}</div></div>` : "";
  const stampBlock = (() => {
    const mode = company.stampMode || "manual";
    if (mode === "none") return "";
    if (mode === "digital" && company.stampImage) {
      return `<div style="text-align:center;"><img src="${company.stampImage}" style="height:70px;width:70px;object-fit:contain;opacity:0.85;display:block;margin:0 auto 2px;" /><div style="font-size:9px;color:#aaa;">Official Stamp</div></div>`;
    }
    return `<div style="text-align:center;"><div style="width:70px;height:70px;border:2px dashed #bbb;border-radius:50%;margin:0 auto 2px;display:flex;align-items:center;justify-content:center;"><span style="font-size:8px;color:#ccc;text-align:center;line-height:1.3;">ختم<br>Stamp</span></div><div style="font-size:9px;color:#ccc;">يدوي</div></div>`;
  })();

  const sig3 = `<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:32px;gap:8px;">
    <div style="text-align:center;flex:1;"><div style="border-top:1px solid #555;padding-top:5px;font-size:10px;color:#444;">توقيع الموظف / Employee</div></div>
    <div style="text-align:center;flex:1;"><div style="border-top:1px solid #555;padding-top:5px;font-size:10px;color:#444;">توقيع المدير / Manager</div></div>
    <div style="text-align:center;flex:1;">${stampBlock}<div style="border-top:1px solid #555;padding-top:5px;font-size:10px;color:#444;margin-top:4px;">الإدارة / Management</div></div>
  </div>`;
  const sig2 = `<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:32px;gap:40px;">
    <div style="text-align:center;flex:1;"><div style="border-top:1px solid #555;padding-top:5px;font-size:10px;color:#444;">توقيع الموظف / Employee</div></div>
    <div style="text-align:center;flex:1;">${stampBlock}<div style="border-top:1px solid #555;padding-top:5px;font-size:10px;color:#444;margin-top:4px;">توقيع صاحب العمل / Employer</div></div>
  </div>`;
  const renderStamp = () => {
    const mode = company.stampMode || "manual";
    if (mode === "none") {
      return `<div style="display:flex;justify-content:flex-end;margin-top:28px;">
        <div style="text-align:center;">
          <div style="border-top:1px solid #555;width:200px;padding-top:5px;font-size:10px;color:#444;">توقيع المفوّض / Authorized Signature</div>
        </div>
      </div>`;
    }
    if (mode === "digital" && company.stampImage) {
      return `<div style="display:flex;justify-content:flex-end;margin-top:28px;gap:24px;align-items:flex-end;">
        <div style="text-align:center;">
          <img src="${company.stampImage}" style="height:90px;width:90px;object-fit:contain;opacity:0.85;margin-bottom:4px;" />
          <div style="border-top:1px solid #555;width:100px;margin:0 auto;padding-top:5px;font-size:10px;color:#444;">الختم الرسمي / Official Stamp</div>
        </div>
        <div style="text-align:center;">
          <div style="border-top:1px solid #555;width:180px;padding-top:5px;font-size:10px;color:#444;">توقيع المفوّض / Authorized Signature</div>
        </div>
      </div>`;
    }
    // manual (default)
    return `<div style="display:flex;justify-content:flex-end;margin-top:28px;gap:24px;align-items:flex-end;">
      <div style="text-align:center;">
        <div style="width:90px;height:90px;border:2px dashed #bbb;border-radius:50%;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:9px;color:#ccc;text-align:center;line-height:1.4;">ختم<br>Stamp</span>
        </div>
        <div style="font-size:9px;color:#bbb;">مساحة الختم اليدوي</div>
      </div>
      <div style="text-align:center;">
        <div style="border-top:1px solid #555;width:180px;padding-top:5px;font-size:10px;color:#444;">توقيع المفوّض / Authorized Signature</div>
      </div>
    </div>`;
  };
  const stamp = renderStamp();
  const pledgeText = (arText, enText) => `<div style="border:1px solid ${c};padding:12px;border-radius:4px;background:#f8f6ff;margin-bottom:14px;font-size:11px;line-height:1.8;color:#333;">
    <strong>الإقرار (عربي):</strong> ${arText}<br><br><strong>Pledge (English):</strong> ${enText}</div>`;

  const bodies = {
    job_offer: h("عرض وظيفي","Job Offer") +
      `<div style="margin-bottom:14px;color:#333;font-size:12px;line-height:1.9;">يسعدنا أن نتقدم إلى السيد/السيدة <strong>${data.empName||"___"}</strong> بهذا العرض الوظيفي من شركة <strong>${company.name}</strong>:<br><span style="color:#888;font-size:10px;">We are pleased to extend this job offer from <strong>${company.nameEn||company.name}</strong> to the above-mentioned candidate:</span></div>` +
      tbl(row("المسمى الوظيفي","Job Title",data.jobTitle)+row("القسم","Department",data.dept)+row("الراتب الأساسي","Basic Salary",data.salary?data.salary+" SAR":"")+row("البدلات","Allowances",data.allowances?data.allowances+" SAR":"")+row("تاريخ بدء العمل","Start Date",data.startDate)+row("فترة الاختبار","Probation",data.probation)+row("صلاحية العرض حتى","Offer Valid Until",data.offerExpiry)) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;line-height:1.8;">هذا العرض مشروط باستيفاء متطلبات التوثيق وفحوصات ما قبل التوظيف. / This offer is subject to documentation and pre-employment checks.</div>` + sig2,

    contract: h("عقد عمل","Employment Contract") +
      `<div style="font-size:11px;color:#555;margin-bottom:14px;line-height:1.8;">تم إبرام هذا العقد بين شركة <strong>${company.name}</strong> (صاحب العمل) والموظف الآتي بيانه.<br><span style="color:#aaa;">This contract is entered into between <strong>${company.nameEn||company.name}</strong> (Employer) and the following employee.</span></div>` +
      tbl(row("اسم الموظف","Employee Name",data.empName)+row("رقم الهوية / الإقامة","ID",data.empId)+row("الجنسية","Nationality",data.nationality)+row("المسمى الوظيفي","Job Title",data.jobTitle)+row("القسم","Department",data.dept)+row("تاريخ بدء العمل","Start Date",data.startDate)+row("نوع العقد","Contract Type",data.contractType)+(data.endDate?row("تاريخ الانتهاء","End Date",data.endDate):"")+row("الراتب الأساسي","Basic Salary",data.salary?data.salary+" SAR":"")+row("البدلات","Allowances",data.allowances?data.allowances+" SAR":"")+row("ساعات العمل","Work Hours",data.workHours?data.workHours+" hrs/day":"")+row("فترة الاختبار","Probation",data.probation)) +
      `<div style="font-size:10px;color:#777;border:1px solid #eee;padding:8px;background:#fafafa;margin-bottom:14px;line-height:1.8;">يلتزم الطرفان بأحكام نظام العمل السعودي. / Both parties agree to comply with Saudi Labor Law.</div>` + sig2,

    joining: h("نموذج مباشرة عمل","Joining Report") +
      tbl(row("اسم الموظف","Employee Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى الوظيفي","Job Title",data.jobTitle)+row("القسم","Department",data.dept)+row("تاريخ المباشرة","Joining Date",data.joinDate)+row("المدير المباشر","Line Manager",data.manager)) +
      `<div style="font-size:11px;color:#333;margin-bottom:14px;line-height:1.8;">يُقرّ الموظف المذكور أعلاه بمباشرة عمله فعلياً في التاريخ المحدد. / The above-mentioned employee confirms having commenced employment on the stated date.</div>` + sig3,

    nda: h("اتفاقية عدم إفصاح","NDA") +
      tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى الوظيفي","Title",data.jobTitle)+row("تاريخ التوقيع","Sign Date",data.signDate)) +
      pledgeText(
        `أتعهد أنا الموظف المذكور أعلاه بعدم الإفصاح عن أي معلومات سرية خاصة بشركة ${company.name} سواء أثناء فترة عملي أو بعد انتهائها.`,
        `I, the undersigned, pledge not to disclose any confidential information belonging to ${company.nameEn||company.name} during or after my employment.`
      ) + sig2,

    asset_recv: h("نموذج استلام عهدة","Asset Handover Form") +
      tbl(row("اسم الموظف","Employee Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("تاريخ الاستلام","Received Date",data.recvDate)) +
      box("قائمة العهد","Assets List",data.items) +
      `<div style="font-size:11px;color:#333;margin-bottom:14px;line-height:1.8;">أتعهد بالحفاظ على هذه العهد وإعادتها بحالة جيدة عند انتهاء خدمتي. / I pledge to maintain these assets and return them in good condition upon end of service.</div>` + sig3,

    leave: h("طلب إجازة","Leave Request") +
      tbl(row("اسم الموظف","Employee Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("نوع الإجازة","Leave Type",data.leaveType)+row("من","From",data.dateFrom)+row("إلى","To",data.dateTo)+row("عدد الأيام","Days",data.days)) +
      box("السبب","Reason",data.reason) + sig3,

    salary_cert: h("شهادة راتب","Salary Certificate") +
      `<div style="margin-bottom:12px;font-size:11px;color:#333;line-height:1.8;">تُفيد شركة <strong>${company.name}</strong> بأن الموظف الآتي يعمل لديها. / <span style="color:#888;">${company.nameEn||""} certifies that the following employee is on its payroll.</span></div>` +
      tbl(row("الاسم","Full Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ الالتحاق","Hire Date",data.hireDate)+row("الراتب الأساسي","Basic Salary",data.salary?data.salary+" SAR":"")+row("البدلات","Allowances",data.allowances?data.allowances+" SAR":"")+row("الإجمالي","Total",data.totalSalary?`<strong style="color:${c};font-size:14px;">${data.totalSalary} SAR</strong>`:"")) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;line-height:1.8;">أُصدرت لتقديمها إلى: <strong>${data.issuedFor||"الجهة المعنية"}</strong> / Issued to: <strong>${data.issuedFor||"the concerned party"}</strong>. لا تُعدّ هذه الشهادة ضماناً باستمرار العقد.</div>` + stamp,

    intro_letter: h("خطاب تعريف","Introduction Letter") +
      tbl(row("الاسم","Full Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("الجنسية","Nationality",data.nationality)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ الالتحاق","Hire Date",data.hireDate)) +
      `<div style="font-size:11px;color:#333;margin-bottom:14px;line-height:1.8;">يعمل لدينا حتى تاريخه موظفاً نظامياً، وقد أُصدر هذا الخطاب لتقديمه إلى: <strong>${data.issuedFor||"الجهة المعنية"}</strong>.<br><span style="color:#aaa;">Currently employed with us. This letter is issued upon request for submission to: <strong>${data.issuedFor||"the concerned party"}</strong>.</span></div>` + stamp,

    advance: h("طلب سلفة","Salary Advance") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الراتب","Salary",data.salary?data.salary+" SAR":"")+row("مبلغ السلفة","Advance",data.amount?`<strong style="color:${c};">${data.amount} SAR</strong>`:"")+row("أشهر الاستقطاع","Deduction Months",data.months)+row("التاريخ","Date",data.date)) + box("السبب","Reason",data.reason) + sig3,

    timesheet: h("كشف وقت العمل","Timesheet") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("الشهر","Month",data.month)+row("إجمالي أيام العمل","Work Days",data.totalDays)+row("ساعات إضافية","OT Hours",data.otHours)+row("أيام الغياب","Absent Days",data.absences)) + box("ملاحظات","Notes",data.notes) + sig3,

    overtime: h("طلب عمل إضافي","Overtime Request") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("التاريخ","Date",data.otDate)+row("وقت البدء","Start",data.startTime)+row("وقت الانتهاء","End",data.endTime)+row("عدد الساعات","Hours",data.hours?data.hours+" hrs":"")) + box("السبب","Reason",data.reason) + sig3,

    biztrip: h("مهمة عمل / انتداب","Business Trip") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الوجهة","Destination",data.dest)+row("من","From",data.dateFrom)+row("إلى","To",data.dateTo)+row("بدل الانتداب","Allowance",data.allowance?data.allowance+" SAR":"")) + box("الغرض","Purpose",data.purpose) + sig3,

    performance: h("تقييم أداء","Performance Appraisal") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("فترة التقييم","Period",data.period)) +
      `<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead><tr style="background:${c};color:#fff;font-size:11px;">
        <th style="padding:7px 10px;text-align:right;">المعيار / Criteria</th><th style="padding:7px 10px;text-align:center;width:90px;">الدرجة</th><th style="padding:7px 10px;text-align:center;width:110px;">التقدير</th>
      </tr></thead><tbody>
      ${[["الأداء الوظيفي","Job Performance",data.score1],["الالتزام","Commitment",data.score2],["العمل الجماعي","Teamwork",data.score3],["المبادرة","Initiative",data.score4]].map(([ar,en,s])=>{const n=parseInt(s)||0;const g=n>=9?"ممتاز / Excellent":n>=7?"جيد جداً / Very Good":n>=5?"جيد / Good":"يحتاج تطوير / Needs Improvement";return `<tr><td style="padding:6px 10px;border:1px solid #eee;font-size:11px;">${ar} / <span style="color:#aaa">${en}</span></td><td style="padding:6px 10px;border:1px solid #eee;text-align:center;font-weight:700;">${s||"—"} / 10</td><td style="padding:6px 10px;border:1px solid #eee;text-align:center;font-size:10px;">${s?g:"—"}</td></tr>`;}).join("")}
      <tr style="background:#f5f5f7;font-weight:700;"><td style="padding:6px 10px;border:1px solid #eee;font-size:11px;">المجموع / Total</td><td style="padding:6px 10px;border:1px solid #eee;text-align:center;color:${c};font-size:14px;">${[data.score1,data.score2,data.score3,data.score4].reduce((a,b)=>(a||0)+(parseInt(b)||0),0)} / 40</td><td style="border:1px solid #eee;"></td></tr>
      </tbody></table>` + box("ملاحظات المقيّم","Reviewer Notes",data.comments) + sig3,

    verbal_warn: h("لفت نظر شفهي","Verbal Warning Record") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("التاريخ","Date",data.date)+row("اسم المدير","Manager",data.manager)) + box("السلوك المخالف","Violation",data.violation) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;">يُقرّ الموظف باستلامه هذا التنبيه الشفهي. / Employee acknowledges receipt of this verbal warning.</div>` + sig3,

    warning: h("خطاب إنذار","Written Warning") +
      `<div style="margin-bottom:12px;font-size:12px;color:#333;line-height:1.9;">بناءً على ما تبين للإدارة، يُوجَّه هذا <strong style="color:${c};">${data.warningType||"الإنذار"}</strong> للموظف:<br><span style="color:#aaa;font-size:10px;">Based on management's findings, this <strong>${data.warningType||"warning"}</strong> is issued to the employee:</span></div>` +
      tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("التاريخ","Date",data.date)) +
      `<div style="border:2px solid ${c};padding:12px;border-radius:4px;background:#fff8f8;margin-bottom:12px;font-size:12px;"><strong>المخالفة / Violation:</strong><br>${data.violation||"..."}</div>` +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;line-height:1.7;">وعليه يُطلب منه تصحيح هذا الوضع فوراً وإلا تعرّض للمساءلة. / The employee is required to immediately rectify this behavior, otherwise further action will be taken.</div>` + sig3,

    deduction: h("قرار خصم","Deduction Order") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("أيام الخصم","Days",data.days)+row("المبلغ المخصوم","Amount",data.amount?data.amount+" SAR":"")+row("التاريخ","Date",data.date)) + box("سبب الخصم","Reason",data.reason) + sig3,

    investigation: h("محضر تحقيق إداري","Investigation Record") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("التاريخ","Date",data.date)) + box("وصف الحادثة","Incident",data.incident) + box("أقوال الموظف","Employee Statement",data.empReply) + box("قرار لجنة التحقيق","Committee Decision",data.decision) + sig3,

    resignation: h("طلب استقالة","Resignation Letter") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ الالتحاق","Hire Date",data.hireDate)+row("تاريخ الاستقالة","Resignation Date",data.resignDate)+row("آخر يوم عمل","Last Day",data.lastDay)) + box("السبب","Reason",data.reason) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;">أتعهد بإتمام إجراءات التسليم. / I commit to completing the handover process.</div>` + sig3,

    resign_accept: h("قبول استقالة","Resignation Acceptance") +
      `<div style="margin-bottom:12px;font-size:12px;color:#333;line-height:1.9;">تُقرّ الإدارة بقبول استقالة الموظف وفق التفاصيل الآتية:<br><span style="color:#aaa;font-size:10px;">Management hereby accepts the resignation of the below-mentioned employee:</span></div>` +
      tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ تقديم الاستقالة","Resignation Date",data.resignDate)+row("آخر يوم عمل محدد","Last Working Day",data.lastDay)) + sig2,

    termination: h("إنهاء خدمات","Termination Notice") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ الالتحاق","Hire Date",data.hireDate)+row("تاريخ الإنهاء","Termination Date",data.termDate)) + box("سبب الإنهاء","Reason",data.reason) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;">يلتزم الموظف بتسليم جميع ممتلكات الشركة. / The employee must return all company assets.</div>` + sig2,

    clearance: h("إخلاء طرف","Clearance Form") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("آخر يوم عمل","Last Working Day",data.lastDay)) +
      `<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead><tr style="background:${c};color:#fff;font-size:11px;"><th style="padding:7px;">الجهة / Department</th><th style="padding:7px;">التوقيع / Signature</th><th style="padding:7px;">التاريخ / Date</th><th style="padding:7px;">ملاحظات / Notes</th></tr></thead>
      <tbody>${["المالية / Finance","IT / تقنية المعلومات","المخازن / Stores","الأمن / Security","المدير المباشر / Manager","الموارد البشرية / HR"].map(d=>`<tr><td style="padding:8px;border:1px solid #eee;font-size:11px;">${d}</td><td style="padding:8px;border:1px solid #eee;"></td><td style="padding:8px;border:1px solid #eee;"></td><td style="padding:8px;border:1px solid #eee;"></td></tr>`).join("")}</tbody></table>` + sig2,

    final_settle: h("مخالصة نهائية","Final Settlement") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("تاريخ الالتحاق","Hire Date",data.hireDate)+row("آخر يوم عمل","Last Day",data.lastDay)+row("مكافأة نهاية الخدمة","EOSB",data.eosb?data.eosb+" SAR":"")+row("رصيد الإجازات","Leave Balance",data.leaveBalance?data.leaveBalance+" days":"")+row("قيمة الإجازات","Leave Encashment",data.leaveAmount?data.leaveAmount+" SAR":"")+row("الخصومات","Deductions",data.deductions?data.deductions+" SAR":"")+row("الإجمالي المستحق","Total Dues",data.totalAmount?`<strong style="color:${c};font-size:15px;">${data.totalAmount} SAR</strong>`:"")) +
      `<div style="border:2px solid ${c};padding:10px 14px;border-radius:4px;font-size:10px;color:#444;margin-bottom:14px;line-height:1.8;">يُقرّ الموظف باستلام كامل مستحقاته وعدم وجود أي مطالبة مستقبلية على الشركة. / The employee acknowledges full receipt of all dues and waives any future claims.</div>` + sig2,

    experience: h("شهادة خبرة","Experience Certificate") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("الجنسية","Nationality",data.nationality)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ الالتحاق","From",data.hireDate)+row("آخر يوم","To",data.lastDay)+row("السلوك","Conduct",data.conduct)) +
      `<div style="font-size:11px;color:#333;margin-bottom:14px;line-height:1.8;">أدّى مهامه بكفاءة واجتهاد ونتمنى له التوفيق. / Performed duties with dedication and professionalism. We wish them success.</div>` + stamp,

    promotion: h("خطاب ترقية","Promotion Letter") +
      `<div style="margin-bottom:12px;font-size:12px;color:#333;line-height:1.9;">يسعدنا إخطار الموظف بترقيته وفق التفاصيل التالية:<br><span style="color:#aaa;font-size:10px;">We are pleased to inform the employee of their promotion as follows:</span></div>` +
      tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى الحالي","Current Title",data.oldTitle)+row("المسمى الجديد","New Title",`<strong style="color:${c};">${data.newTitle||""}</strong>`)+row("القسم","Dept",data.dept)+row("الراتب الحالي","Current Salary",data.oldSalary?data.oldSalary+" SAR":"")+row("الراتب الجديد","New Salary",data.newSalary?`<strong style="color:${c};">${data.newSalary} SAR</strong>`:"")+row("تاريخ السريان","Effective Date",data.effDate)) + sig2,

    transfer: h("أمر نقل","Transfer Order") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("من","From",data.fromDept)+row("إلى","To",`<strong style="color:${c};">${data.toDept||""}</strong>`)+row("تاريخ السريان","Effective Date",data.effDate)) + box("السبب","Reason",data.reason) + sig3,

    freeform: `<div style="direction:rtl;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">${hdr.replace("<div style=\"direction:rtl;font-family:'Segoe UI',Tahoma,Arial,sans-serif;\">","")}
      <div style="text-align:center;margin-bottom:18px;"><div style="font-size:17px;font-weight:900;color:${c};border:2px solid ${c};display:inline-block;padding:6px 26px;border-radius:4px;">${data.subject||"الموضوع / Subject"}</div><div style="font-size:10px;color:#aaa;margin-top:4px;">${tAr} | ${tEn}</div></div>
      ${data.recipient?`<div style="margin-bottom:14px;font-size:12px;"><strong>إلى / To:</strong> ${data.recipient}</div>`:""}
      <div style="min-height:200px;border:1px solid #eee;padding:14px;background:#fafafa;border-radius:4px;font-size:12px;line-height:1.9;white-space:pre-wrap;">${data.body||""}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:28px;"><div style="text-align:center;"><div style="border-top:1px solid #555;width:200px;padding-top:5px;font-size:10px;color:#444;">${data.signedBy||"التوقيع / Signature"}<br><span style="color:#aaa;">${company.name}</span></div></div></div>
      ${ftr.replace("</div>","")}`.slice(0,99999)+"",

    // Medical
    license_check: h("التحقق من صلاحية الترخيص","License Validity Check") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("التخصص","Specialty",data.jobTitle)+row("رقم الترخيص","License No.",data.licenseNo)+row("تاريخ الانتهاء","Expiry",data.licenseExpiry)+row("الحالة","Status",data.status)) + box("ملاحظات","Notes",data.notes) + stamp,

    patient_conf: h("سرية بيانات المرضى","Patient Confidentiality Agreement") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ التوقيع","Sign Date",data.signDate)) +
      pledgeText(`أتعهد بعدم الإفصاح عن أي بيانات أو معلومات تخص المرضى لأي جهة غير مخوّلة، وذلك وفقاً لأحكام نظام الصحة ولوائحه التنفيذية.`,`I pledge not to disclose any patient data or information to unauthorized parties, in compliance with health regulations.`) + sig2,

    shift_roster: h("جدول المناوبات","Shift Roster") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم / الجناح","Ward",data.dept)+row("الشهر","Month",data.month)+row("نوع الوردية","Shift Type",data.shiftType)) + box("تفاصيل الجدول","Schedule Details",data.schedule) + sig2,

    incident_report: h("تقرير حادثة / خطأ طبي","Incident Report") + tbl(row("المُبلِّغ","Reported By",data.empName)+row("رقم الهوية","ID",data.empId)+row("القسم","Ward/Dept",data.dept)+row("تاريخ الحادثة","Incident Date",data.incidentDate)+row("نوع الحادثة","Type",data.incidentType)) + box("وصف الحادثة","Description",data.description) + box("الإجراء المتخذ","Action Taken",data.action) + sig3,

    infection_allow: h("نموذج بدل عدوى","Infection Allowance") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("الشهر","Month",data.month)+row("مبلغ البدل","Allowance",data.amount?data.amount+" SAR":"")) + sig3,

    // Financial
    fin_disclosure: h("إقرار الذمة المالية","Financial Disclosure") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("تعارض مصالح؟","Conflict?",data.conflicts)+row("تاريخ التوقيع","Sign Date",data.signDate)) + box("التفاصيل","Details",data.details) +
      pledgeText(`أُقرّ بصحة المعلومات أعلاه، وأتعهد بالإبلاغ الفوري عن أي تعارض مصالح محتمل.`,`I certify the accuracy of the above information and commit to immediately reporting any potential conflicts of interest.`) + sig2,

    cash_custody: h("استلام عهدة نقدية","Cash Custody Form") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("مبلغ العهدة","Amount",data.amount?data.amount+" SAR":"")+row("الغرض","Purpose",data.purpose)+row("تاريخ الاستلام","Date",data.date)) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;">أتعهد بصرف هذه العهدة في أغراضها المحددة وتقديم الحساب عند الطلب. / I pledge to use this cash for its designated purpose and provide accounting upon request.</div>` + sig2,

    aml_form: h("إقرار مكافحة غسيل الأموال","AML Compliance Form") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("تاريخ التوقيع","Sign Date",data.signDate)) +
      pledgeText(`أُقرّ باطلاعي على سياسة مكافحة غسيل الأموال وتمويل الإرهاب المعتمدة في شركة ${company.name}، وأتعهد بالالتزام بها والإبلاغ عن أي معاملات مشبوهة فوراً.`,`I acknowledge that I have read and understood the AML/CFT policy of ${company.nameEn||company.name} and commit to compliance, including immediate reporting of suspicious transactions.`) + sig2,

    cash_count: h("محضر جرد الصندوق","Cash Count Record") + tbl(row("المسؤول","Cashier",data.empName)+row("رقم الهوية","ID",data.empId)+row("تاريخ الجرد","Count Date",data.date)+row("الرصيد حسب النظام","System Balance",data.systemBal?data.systemBal+" SAR":"")+row("الرصيد الفعلي","Actual Balance",data.actualBal?data.actualBal+" SAR":"")+row("الفرق","Difference",data.diff?`<strong style="color:${parseFloat(data.diff)!==0?"red":c};">${data.diff} SAR</strong>`:"")) + box("ملاحظات","Notes",data.notes) + sig3,

    // Construction
    ppe_receipt: h("استلام مهمات السلامة","PPE Receipt") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الموقع / المشروع","Site",data.site)+row("تاريخ الاستلام","Date",data.date)) + box("قائمة المهمات","PPE Items",data.items) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;">أتعهد بارتداء مهمات السلامة في موقع العمل والإبلاغ عن أي تلف. / I pledge to wear PPE on-site and report any damage.</div>` + sig2,

    site_permit: h("تصريح دخول موقع","Site Access Permit") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الموقع","Site",data.site)+row("الغرض","Purpose",data.purpose)+row("من","From",data.dateFrom)+row("إلى","To",data.dateTo)) + stamp,

    work_injury: h("نموذج إصابة عمل","Work Injury Report") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("موقع الحادثة","Site",data.site)+row("تاريخ الإصابة","Date",data.injuryDate)+row("نوع الإصابة","Type",data.injuryType)+row("الشهود","Witnesses",data.witnesses)) + box("وصف الحادثة","Description",data.description) + sig3,

    site_transfer: h("نقل موظف بين المواقع","Site Transfer Form") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("من موقع","From Site",data.fromSite)+row("إلى موقع","To Site",`<strong style="color:${c};">${data.toSite||""}</strong>`)+row("تاريخ السريان","Effective Date",data.effDate)) + box("السبب","Reason",data.reason) + sig3,

    // Retail
    uniform_recv: h("استلام الزي الرسمي","Uniform Receipt") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الفرع","Branch",data.branch)+row("تاريخ الاستلام","Date",data.date)) + box("قطع الزي","Uniform Items",data.items) +
      `<div style="font-size:10px;color:#777;margin-bottom:14px;">أتعهد بالحفاظ على الزي الرسمي وإعادته نظيفاً عند انتهاء خدمتي. / I pledge to maintain the uniform and return it clean upon end of service.</div>` + sig2,

    inventory_short: h("إقرار عجز المخزون","Inventory Shortage") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الفرع","Branch",data.branch)+row("القيمة التقديرية","Value",data.amount?data.amount+" SAR":"")+row("تاريخ الاكتشاف","Date",data.date)) + box("المواد الناقصة","Missing Items",data.items) +
      pledgeText(`أُقرّ باكتشاف العجز في المخزون المذكور أعلاه وأتحمل المسؤولية وفق ما تقرره الإدارة.`,`I acknowledge the inventory shortage described above and accept responsibility as determined by management.`) + sig2,

    health_card: h("متابعة الفحص الصحي","Health Card Tracker") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("الفرع","Branch",data.branch)+row("تاريخ انتهاء الشهادة","Card Expiry",data.cardExpiry)+row("الحالة","Status",data.status)) + stamp,

    // Tech
    ip_assign: h("اتفاقية الملكية الفكرية","IP Assignment Agreement") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ التوقيع","Sign Date",data.signDate)) +
      pledgeText(`أُقرّ بأن جميع المنتجات والأكواد البرمجية والابتكارات التي أطورها خلال فترة عملي في شركة ${company.name} هي ملك حصري للشركة.`,`I acknowledge that all products, code, and innovations I develop during my employment at ${company.nameEn||company.name} are the exclusive intellectual property of the company.`) + sig2,

    remote_policy: h("سياسة العمل عن بعد","Remote Work Policy") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("أيام العمل عن بعد","Remote Days",data.workDays)+row("ساعات العمل","Work Hours",data.hours)+row("تاريخ التوقيع","Sign Date",data.signDate)) +
      pledgeText(`أتعهد بالالتزام بساعات العمل المحددة أثناء العمل عن بعد، والحضور في الاجتماعات المطلوبة، وعدم إفشاء بيانات الشركة عبر شبكات غير آمنة.`,`I commit to maintaining specified work hours while working remotely, attending required meetings, and not sharing company data over unsecured networks.`) + sig2,

    cyber_pledge: h("تعهد أمن المعلومات","Cybersecurity Pledge") + tbl(row("الاسم","Name",data.empName)+row("رقم الهوية","ID",data.empId)+row("المسمى","Title",data.jobTitle)+row("القسم","Dept",data.dept)+row("تاريخ التوقيع","Sign Date",data.signDate)) +
      pledgeText(`أتعهد بعدم مشاركة كلمات المرور أو بيانات الشركة مع أي طرف خارجي، وبالإبلاغ فوراً عن أي اختراق أمني محتمل.`,`I pledge not to share passwords or company data with any external party, and to immediately report any potential security breach.`) + sig2,
  };

  // freeform special handling
  if (formId === "freeform") {
    return `<div style="direction:rtl;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:3px solid ${c};margin-bottom:18px;">
        <div>${logoHtml}<div style="font-size:9px;color:#999;letter-spacing:1px;margin-top:2px;">${company.tagline||""}</div></div>
        <div style="text-align:left;font-size:10px;color:#555;line-height:1.9;"><div>${company.address}</div><div>${company.phone} | ${company.email} | ${company.website}</div></div>
      </div>
      <div style="text-align:center;margin-bottom:18px;"><div style="font-size:17px;font-weight:900;color:${c};border:2px solid ${c};display:inline-block;padding:6px 26px;border-radius:4px;">${data.subject||"الموضوع / Subject"}</div><div style="font-size:10px;color:#aaa;margin-top:4px;">${tAr} | ${tEn}</div></div>
      ${data.recipient?`<div style="margin-bottom:14px;font-size:12px;"><strong>إلى / To:</strong> ${data.recipient}</div>`:""}
      <div style="min-height:200px;border:1px solid #eee;padding:14px;background:#fafafa;border-radius:4px;font-size:12px;line-height:1.9;white-space:pre-wrap;">${data.body||""}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:28px;"><div style="text-align:center;"><div style="border-top:1px solid #555;width:200px;padding-top:5px;font-size:10px;color:#444;">${data.signedBy||"التوقيع / Signature"}<br><span style="color:#aaa;">${company.name}</span></div></div></div>
      ${ftr}`;
  }

  return hdr + (bodies[formId] || "<p>النموذج غير متاح / Form not found</p>") + ftr;
}

// ─── Category labels ───────────────────────────────────────────────────────
const CAT_LABELS = {
  onboarding:   { ar:"التوظيف والتعيين",       en:"Onboarding",       icon:"🚀" },
  operations:   { ar:"العمليات والطلبات",       en:"Operations",       icon:"⚙️" },
  discipline:   { ar:"التقييم والإنذارات",      en:"Performance & Discipline", icon:"📋" },
  offboarding:  { ar:"إنهاء الخدمات",           en:"Offboarding",      icon:"🚪" },
  medical:      { ar:"الطبي والصحي",            en:"Medical",          icon:"🏥" },
  financial:    { ar:"المالي والمحاسبي",         en:"Financial",        icon:"💰" },
  construction: { ar:"المقاولات والسلامة",       en:"Construction",     icon:"🏗️" },
  retail:       { ar:"التجزئة والمطاعم",         en:"Retail / F&B",     icon:"🛒" },
  tech:         { ar:"التقنية والبرمجة",         en:"Tech / Software",  icon:"💻" },
};

// ─── Setup Page ────────────────────────────────────────────────────────────
function SetupPage({ localCompany, setLocalCompany, saved, onSave, onBack, fileRef, stampFileRef, handleLogoUpload, handleStampUpload }) {
  const c = localCompany.primaryColor;
  return (
    <div style={{minHeight:"100vh",background:"#f5f5f7",direction:"rtl",fontFamily:"Segoe UI,Tahoma,Arial,sans-serif"}}>
      <header style={{background:c,color:"#fff",padding:"16px 28px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:13}}>← رجوع</button>
        <h1 style={{margin:0,fontSize:18}}>⚙️ إعدادات الشركة</h1>
      </header>
      <div style={{maxWidth:800,margin:"24px auto",padding:"0 16px"}}>
        {/* Industry Selector */}
        <div style={{background:"#fff",borderRadius:10,padding:24,marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,color:"#333"}}>🏢 مجال الشركة <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>سيحدد النماذج المتاحة تلقائياً</span></h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {INDUSTRIES.map(ind => (
              <div key={ind.id} onClick={()=>setLocalCompany(p=>({...p,industry:ind.id,primaryColor:ind.color}))}
                style={{border:`2px solid ${localCompany.industry===ind.id?ind.color:"#e5e5e5"}`,borderRadius:8,padding:"12px 14px",cursor:"pointer",background:localCompany.industry===ind.id?ind.color+"12":"#fff",transition:"all 0.15s"}}>
                <div style={{fontSize:22,marginBottom:4}}>{ind.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:localCompany.industry===ind.id?ind.color:"#333"}}>{ind.label}</div>
                <div style={{fontSize:10,color:"#aaa"}}>{ind.labelEn}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Company Fields */}
        <div style={{background:"#fff",borderRadius:10,padding:24,marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,color:"#333"}}>📋 بيانات الشركة</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[["name","اسم الشركة (عربي)","Arabic Name"],["nameEn","اسم الشركة (إنجليزي)","English Name"],["address","العنوان (عربي)","Address AR"],["addressEn","العنوان (إنجليزي)","Address EN"],["phone","رقم الهاتف","Phone"],["email","البريد الإلكتروني","Email"],["website","الموقع الإلكتروني","Website"],["tagline","الشعار (Tagline)","Tagline"]].map(([key,label,sub])=>(
              <div key={key}>
                <label style={{display:"block",marginBottom:5,fontSize:12,color:"#555",fontWeight:600}}>{label}<span style={{fontSize:10,color:"#bbb",fontWeight:400,marginRight:5}}>{sub}</span></label>
                <input value={localCompany[key]||""} onChange={e=>setLocalCompany(p=>({...p,[key]:e.target.value}))}
                  style={{width:"100%",border:"1px solid #ddd",borderRadius:6,padding:"7px 10px",fontSize:13,outline:"none",boxSizing:"border-box"}} />
              </div>
            ))}
            <div>
              <label style={{display:"block",marginBottom:5,fontSize:12,color:"#555",fontWeight:600}}>اللون الرئيسي</label>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="color" value={localCompany.primaryColor} onChange={e=>setLocalCompany(p=>({...p,primaryColor:e.target.value}))}
                  style={{width:44,height:34,border:"none",cursor:"pointer",borderRadius:4}} />
                <div style={{width:34,height:34,borderRadius:4,background:localCompany.primaryColor,border:"1px solid #eee"}} />
                <span style={{fontSize:11,color:"#aaa"}}>{localCompany.primaryColor}</span>
              </div>
            </div>
          </div>
          <div style={{marginTop:16}}>
            <label style={{display:"block",marginBottom:8,fontSize:12,color:"#555",fontWeight:600}}>شعار الشركة (Logo)</label>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              {localCompany.logo && <img src={localCompany.logo} style={{height:52,borderRadius:6,border:"1px solid #eee",padding:4,background:"#f8f8f8"}} />}
              <button onClick={()=>fileRef.current.click()} style={{background:c,color:"#fff",border:"none",padding:"8px 18px",borderRadius:6,cursor:"pointer",fontSize:12}}>📁 رفع الشعار</button>
              {localCompany.logo && <button onClick={()=>setLocalCompany(p=>({...p,logo:null}))} style={{background:"#fee",color:"#c00",border:"1px solid #fcc",padding:"8px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>🗑️ حذف</button>}
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleLogoUpload} />
            </div>
          </div>
        </div>

        {/* Stamp Settings */}
        <div style={{background:"#fff",borderRadius:10,padding:24,marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,color:"#333"}}>🔏 إعدادات الختم <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>Stamp Settings</span></h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
            {[
              {mode:"digital", icon:"✅", label:"ختم رقمي", sub:"Digital Stamp"},
              {mode:"manual",  icon:"⭕", label:"مساحة ختم يدوي", sub:"Manual Stamp Space"},
              {mode:"none",    icon:"✍️", label:"توقيع فقط", sub:"Signature Only"},
            ].map(opt => (
              <div key={opt.mode} onClick={()=>setLocalCompany(p=>({...p,stampMode:opt.mode}))}
                style={{border:`2px solid ${localCompany.stampMode===opt.mode?c:"#e5e5e5"}`,borderRadius:8,padding:"14px 12px",cursor:"pointer",background:localCompany.stampMode===opt.mode?c+"12":"#fff",transition:"all 0.15s",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:6}}>{opt.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:localCompany.stampMode===opt.mode?c:"#333"}}>{opt.label}</div>
                <div style={{fontSize:10,color:"#aaa"}}>{opt.sub}</div>
              </div>
            ))}
          </div>

          {localCompany.stampMode === "digital" && (
            <div style={{borderTop:"1px solid #f0f0f0",paddingTop:16}}>
              <label style={{display:"block",marginBottom:10,fontSize:13,color:"#555",fontWeight:600}}>صورة الختم الرقمي <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>— يُفضَّل PNG بخلفية شفافة</span></label>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                {localCompany.stampImage && (
                  <div style={{position:"relative",background:"#f8f8f8",border:"1px solid #eee",borderRadius:8,padding:8}}>
                    <img src={localCompany.stampImage} style={{height:80,width:80,objectFit:"contain",display:"block"}} />
                    <div style={{fontSize:9,color:"#aaa",textAlign:"center",marginTop:4}}>معاينة</div>
                  </div>
                )}
                <button onClick={()=>stampFileRef.current.click()} style={{background:c,color:"#fff",border:"none",padding:"9px 18px",borderRadius:6,cursor:"pointer",fontSize:12}}>📁 رفع صورة الختم</button>
                {localCompany.stampImage && <button onClick={()=>setLocalCompany(p=>({...p,stampImage:null}))} style={{background:"#fee",color:"#c00",border:"1px solid #fcc",padding:"9px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>🗑️ حذف</button>}
                <input ref={stampFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleStampUpload} />
              </div>
            </div>
          )}

          {localCompany.stampMode === "manual" && (
            <div style={{borderTop:"1px solid #f0f0f0",paddingTop:14,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:70,height:70,border:"2px dashed #bbb",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:10,color:"#ccc",textAlign:"center",lineHeight:1.4}}>ختم<br/>Stamp</span>
              </div>
              <div style={{fontSize:12,color:"#666",lineHeight:1.7}}>
                ستظهر دائرة فارغة منقطة في النماذج لوضع الختم اليدوي عليها بعد الطباعة.<br/>
                <span style={{fontSize:11,color:"#aaa"}}>A dashed circle will appear on printed forms for physical stamping.</span>
              </div>
            </div>
          )}

          {localCompany.stampMode === "none" && (
            <div style={{borderTop:"1px solid #f0f0f0",paddingTop:14,fontSize:12,color:"#888",lineHeight:1.7}}>
              ✍️ النماذج ستحتوي على خطوط التوقيع فقط بدون أي مساحة للختم.<br/>
              <span style={{fontSize:11,color:"#aaa"}}>Forms will contain signature lines only with no stamp area.</span>
            </div>
          )}
        </div>

        <button onClick={()=>onSave(localCompany)} style={{background:c,color:"#fff",border:"none",padding:"13px",borderRadius:8,cursor:"pointer",fontSize:15,fontWeight:700,width:"100%"}}>
          {saved ? "✅ تم الحفظ!" : "💾 حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}

// ─── Form Page (stamp selector inline) ────────────────────────────────────
function FormPage({ activeForm, formData, setFormData, company, onBack }) {
  const def = FORM_FIELDS[activeForm];
  const c = company.primaryColor;

  // Stamp state — lives here, updates preview live
  const [stampMode, setStampMode] = useState(company.stampMode || "manual");
  const [stampImage, setStampImage] = useState(company.stampImage || null);
  const stampInputRef = useRef();

  const handleStampFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { setStampImage(ev.target.result); setStampMode("digital"); };
    r.readAsDataURL(f);
  };

  const printCompany = { ...company, stampMode, stampImage: stampMode === "digital" ? stampImage : null };
  const preview = buildDoc(activeForm, formData, printCompany);

  const doPrint = () => printHtml(preview);

  const stampOpts = [
    { id:"digital", icon:"✅", ar:"ختم رقمي",    en:"Digital" },
    { id:"manual",  icon:"⭕", ar:"ختم يدوي",     en:"Manual" },
    { id:"none",    icon:"✍️", ar:"توقيع فقط",    en:"Sig only" },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#f5f5f7",direction:"rtl",fontFamily:"Segoe UI,Tahoma,Arial,sans-serif"}}>
      <header style={{background:c,color:"#fff",padding:"13px 24px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:13}}>← رجوع</button>
        <h1 style={{margin:0,fontSize:16}}>{def?.title} <span style={{fontWeight:400,fontSize:13,opacity:0.8}}>| {def?.titleEn}</span></h1>
      </header>

      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:18,padding:18,maxWidth:1280,margin:"0 auto"}}>
        {/* ── Left panel: fields + stamp ── */}
        <div style={{background:"#fff",borderRadius:10,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",height:"fit-content",position:"sticky",top:18}}>

          {/* Form fields */}
          <h3 style={{margin:"0 0 14px",color:c,fontSize:14}}>بيانات النموذج</h3>
          {def?.fields.map(f=>(
            <div key={f.key} style={{marginBottom:11}}>
              <label style={{display:"block",marginBottom:4,fontSize:11,color:"#555",fontWeight:600}}>
                {f.label} <span style={{color:"#ccc",fontWeight:400}}>/ {f.labelEn}</span>
              </label>
              {f.type==="textarea"
                ? <textarea value={formData[f.key]||""} onChange={e=>setFormData(p=>({...p,[f.key]:e.target.value}))}
                    placeholder={f.placeholder} rows={f.rows||4}
                    style={{width:"100%",border:"1px solid #ddd",borderRadius:6,padding:"7px 9px",fontSize:12,outline:"none",resize:"vertical",boxSizing:"border-box"}} />
                : f.type==="select"
                ? <select value={formData[f.key]||""} onChange={e=>setFormData(p=>({...p,[f.key]:e.target.value}))}
                    style={{width:"100%",border:"1px solid #ddd",borderRadius:6,padding:"7px 9px",fontSize:12,outline:"none",background:"#fff",boxSizing:"border-box"}}>
                    <option value="">-- اختر --</option>
                    {f.options.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                : <input type={f.type||"text"} value={formData[f.key]||""} onChange={e=>setFormData(p=>({...p,[f.key]:e.target.value}))}
                    placeholder={f.placeholder}
                    style={{width:"100%",border:"1px solid #ddd",borderRadius:6,padding:"7px 9px",fontSize:12,outline:"none",boxSizing:"border-box"}} />
              }
            </div>
          ))}

          {/* ── Stamp / Signature selector ── */}
          <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #f0f0f0"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:10}}>
              🔏 الختم والتوقيع <span style={{fontSize:10,color:"#bbb",fontWeight:400}}>Stamp & Signature</span>
            </div>

            {/* 3 options as compact toggle */}
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {stampOpts.map(o=>(
                <div key={o.id} onClick={()=>setStampMode(o.id)}
                  style={{flex:1,border:`2px solid ${stampMode===o.id?c:"#e5e5e5"}`,borderRadius:8,padding:"8px 4px",cursor:"pointer",textAlign:"center",background:stampMode===o.id?c+"12":"#fafafa",transition:"all 0.13s"}}>
                  <div style={{fontSize:18,marginBottom:2}}>{o.icon}</div>
                  <div style={{fontSize:10,fontWeight:700,color:stampMode===o.id?c:"#444",lineHeight:1.2}}>{o.ar}</div>
                  <div style={{fontSize:9,color:"#bbb"}}>{o.en}</div>
                </div>
              ))}
            </div>

            {/* Digital stamp upload row */}
            {stampMode === "digital" && (
              <div style={{background:"#f7f7f9",borderRadius:8,padding:10,border:"1px solid #eee",display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                {stampImage
                  ? <img src={stampImage} style={{height:48,width:48,objectFit:"contain",border:"1px solid #eee",borderRadius:6,background:"#fff",padding:2,flexShrink:0}} />
                  : <div style={{width:48,height:48,border:"2px dashed #ccc",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#bbb",textAlign:"center",flexShrink:0,lineHeight:1.3}}>لا<br/>ختم</div>
                }
                <div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>
                  <button onClick={()=>stampInputRef.current.click()}
                    style={{background:c,color:"#fff",border:"none",padding:"5px 10px",borderRadius:5,cursor:"pointer",fontSize:11,textAlign:"center"}}>
                    📁 رفع صورة الختم
                  </button>
                  {stampImage && (
                    <button onClick={()=>setStampImage(null)}
                      style={{background:"#fee",color:"#c00",border:"1px solid #fcc",padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:10}}>
                      🗑️ إزالة الختم
                    </button>
                  )}
                </div>
                <input ref={stampInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleStampFile} />
              </div>
            )}

            {/* Manual stamp note */}
            {stampMode === "manual" && (
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#f7f7f9",borderRadius:7,padding:"8px 10px",border:"1px solid #eee",marginBottom:6}}>
                <div style={{width:36,height:36,border:"2px dashed #ccc",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:8,color:"#ccc",textAlign:"center",lineHeight:1.3}}>ختم</span>
                </div>
                <span style={{fontSize:10,color:"#888",lineHeight:1.5}}>دائرة فارغة للختم اليدوي بعد الطباعة</span>
              </div>
            )}

            {/* None note */}
            {stampMode === "none" && (
              <div style={{background:"#f7f7f9",borderRadius:7,padding:"8px 10px",border:"1px solid #eee",fontSize:10,color:"#888",marginBottom:6}}>
                ✍️ توقيعات فقط — بدون مساحة ختم
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={()=>setFormData({})}
              style={{flex:1,background:"#f5f5f7",border:"1px solid #ddd",padding:"9px",borderRadius:6,cursor:"pointer",fontSize:12}}>
              🗑️ مسح
            </button>
            <button onClick={doPrint}
              style={{flex:2,background:c,color:"#fff",border:"none",padding:"9px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:700}}>
              🖨️ طباعة
            </button>
          </div>
        </div>

        {/* ── Right panel: preview ── */}
        <div style={{background:"#fff",borderRadius:10,padding:24,boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{margin:0,color:c,fontSize:14}}>معاينة / Preview</h3>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:10,color:"#bbb",background:"#f5f5f7",padding:"3px 10px",borderRadius:20}}>ثنائي اللغة · Bilingual</span>
              <button onClick={doPrint}
                style={{background:c,color:"#fff",border:"none",padding:"6px 18px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>
                🖨️ طباعة
              </button>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{__html:preview}}
            style={{border:"1px solid #eee",padding:20,borderRadius:6,direction:"rtl"}} />
        </div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function HRSystem() {
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [localCompany, setLocalCompany] = useState(DEFAULT_COMPANY);
  const [page, setPage] = useState("dashboard");
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();
  const stampFileRef = useRef();

  useEffect(()=>{
    (async()=>{
      try { const r=await storage.get("company-settings"); if(r){const p=JSON.parse(r.value);setCompany(p);setLocalCompany(p);} } catch{}
      setLoading(false);
    })();
  },[]);
  useEffect(()=>{ if(page==="setup") setLocalCompany({...company}); },[page]);

  const saveCompany = async (d) => {
    setCompany(d); try{await storage.set("company-settings",JSON.stringify(d));}catch{}
    setSaved(true); setTimeout(()=>setSaved(false),2500); setPage("dashboard");
  };
  const handleLogoUpload = (e) => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setLocalCompany(p=>({...p,logo:ev.target.result})); r.readAsDataURL(f);
  };
  const handleStampUpload = (e) => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setLocalCompany(p=>({...p,stampImage:ev.target.result})); r.readAsDataURL(f);
  };

  // Filter forms by industry
  const visibleForms = ALL_FORMS.filter(f => f.industries.includes("general") || f.industries.includes(company.industry));
  const industryInfo = INDUSTRIES.find(i=>i.id===company.industry)||INDUSTRIES[0];
  const c = company.primaryColor;

  // Group by category
  const formsByCategory = {};
  visibleForms.forEach(f => { if(!formsByCategory[f.cat]) formsByCategory[f.cat] = []; formsByCategory[f.cat].push(f); });

  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Segoe UI,Tahoma,Arial",direction:"rtl"}}><div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:10}}>⏳</div><div style={{color:c,fontSize:16,fontWeight:600}}>جاري التحميل...</div></div></div>;

  if(page==="setup") return <SetupPage localCompany={localCompany} setLocalCompany={setLocalCompany} saved={saved} onSave={saveCompany} onBack={()=>setPage("dashboard")} fileRef={fileRef} stampFileRef={stampFileRef} handleLogoUpload={handleLogoUpload} handleStampUpload={handleStampUpload} />;
  if(page==="form"&&activeForm) return <FormPage activeForm={activeForm} formData={formData} setFormData={setFormData} company={company} onBack={()=>{setPage("dashboard");setFormData({});}} />;

  return (
    <div style={{minHeight:"100vh",background:"#f0f0f5",direction:"rtl",fontFamily:"Segoe UI,Tahoma,Arial,sans-serif"}}>
      <header style={{background:c,color:"#fff",padding:"16px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {company.logo ? <img src={company.logo} style={{height:40,objectFit:"contain",filter:"brightness(0) invert(1)"}} /> : <div style={{fontSize:20,fontWeight:900}}>{company.nameEn||company.name}</div>}
          <div><div style={{fontWeight:700,fontSize:16}}>{company.name}</div><div style={{fontSize:10,opacity:0.8,letterSpacing:1}}>{company.tagline}</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"rgba(255,255,255,0.15)",padding:"5px 12px",borderRadius:20,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
            <span>{industryInfo.icon}</span><span>{industryInfo.label}</span>
            <span style={{opacity:0.6,fontSize:10}}>({visibleForms.length} نماذج)</span>
          </div>
          <button onClick={()=>setPage("setup")} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.35)",color:"#fff",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>⚙️ الإعدادات</button>
        </div>
      </header>

      <div style={{maxWidth:1150,margin:"0 auto",padding:"20px 24px"}}>
        <div style={{background:"#fff",borderRadius:10,padding:"11px 18px",display:"flex",gap:20,alignItems:"center",marginBottom:20,boxShadow:"0 1px 6px rgba(0,0,0,0.06)",fontSize:11,color:"#666",flexWrap:"wrap"}}>
          <span>📍 {company.address}</span><span>📞 {company.phone}</span><span>✉️ {company.email}</span><span>🌐 {company.website}</span>
          <span style={{marginRight:"auto",color:c,fontWeight:700,fontSize:10,background:c+"15",padding:"3px 12px",borderRadius:20}}>✅ ثنائي اللغة · لترهيد تلقائي</span>
        </div>

        {saved && <div style={{background:"#e8f5e9",border:"1px solid #a5d6a7",borderRadius:8,padding:"10px 18px",marginBottom:18,color:"#2e7d32",fontWeight:600,textAlign:"center",fontSize:13}}>✅ تم حفظ إعدادات الشركة — النماذج تحديثت تلقائياً</div>}

        {Object.entries(formsByCategory).map(([cat, forms]) => {
          const cl = CAT_LABELS[cat];
          return (
            <div key={cat} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:18}}>{cl?.icon}</span>
                <h3 style={{margin:0,fontSize:14,color:"#333",fontWeight:700}}>{cl?.ar}</h3>
                <span style={{fontSize:11,color:"#aaa"}}>{cl?.en}</span>
                <span style={{marginRight:"auto",fontSize:10,color:c,background:c+"15",padding:"2px 10px",borderRadius:20}}>{forms.length} نماذج</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
                {forms.map(f=>(
                  <div key={f.id} onClick={()=>{setActiveForm(f.id);setFormData({});setPage("form");}}
                    style={{background:"#fff",borderRadius:9,padding:"16px 14px",cursor:"pointer",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",border:"2px solid transparent",transition:"all 0.14s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=c;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 16px rgba(0,0,0,0.1)`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.06)";}}>
                    <div style={{fontSize:26,marginBottom:7}}>{f.icon}</div>
                    <div style={{fontWeight:700,fontSize:12,marginBottom:2,color:"#222",lineHeight:1.3}}>{f.title}</div>
                    <div style={{fontSize:10,color:"#bbb",marginBottom:8,lineHeight:1.3}}>{f.titleEn}</div>
                    <div style={{fontSize:10,color:c,fontWeight:600}}>فتح ←</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{marginTop:12,background:c+"10",borderRadius:10,padding:"12px 20px",border:`1px solid ${c}22`,fontSize:11,color:"#555",lineHeight:1.9}}>
          <strong style={{color:c}}>💡</strong> غيّر مجال الشركة من الإعدادات لتظهر نماذج متخصصة إضافية. كل النماذج تُطبع باللغتين العربية والإنجليزية مع لترهيد شركتك تلقائياً.
        </div>
      </div>
    </div>
  );
}
