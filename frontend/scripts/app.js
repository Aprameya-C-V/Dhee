const state = {
  regions: {},
  history: [],
  lastAssistantText: '',
  uiLang: 'en',
  selectedPreset: null,
  presetIndex: 0,
};

const els = {
  region: document.getElementById('region'),
  subregion: document.getElementById('subregion'),
  language: document.getElementById('language'),
  uiLanguage: document.getElementById('uiLanguage'),
  domain: document.getElementById('domain'),
  grade: document.getElementById('grade'),
  lowData: document.getElementById('lowData'),
  autoSee: document.getElementById('autoSee'),
  userInput: document.getElementById('userInput'),
  sendBtn: document.getElementById('sendBtn'),
  chatContainer: document.getElementById('chatContainer'),
  output: document.getElementById('output'),
  imagePrompt: document.getElementById('imagePrompt'),
  genImageBtn: document.getElementById('genImageBtn'),
  gallery: document.getElementById('gallery'),
  currentIllustration: document.getElementById('currentIllustration'),
  illustrationCaption: document.getElementById('illustrationCaption'),
  // presets
  presetList: document.getElementById('presetList'),
  startPresetBtn: document.getElementById('startPresetBtn'),
  nextLessonBtn: document.getElementById('nextLessonBtn'),
  // i18n labels
  titlePersonalization: document.getElementById('titlePersonalization'),
  labelRegion: document.getElementById('labelRegion'),
  labelSubregion: document.getElementById('labelSubregion'),
  labelLanguage: document.getElementById('labelLanguage'),
  labelUiLanguage: document.getElementById('labelUiLanguage'),
  labelDomain: document.getElementById('labelDomain'),
  labelGrade: document.getElementById('labelGrade'),
  labelLowData: document.getElementById('labelLowData'),
  titleIllustrations: document.getElementById('titleIllustrations'),
  labelAutoSee: document.getElementById('labelAutoSee'),
  titleGenerated: document.getElementById('titleGenerated'),
};

// Initialize UI language from localStorage if present
try {
  const savedLang = localStorage.getItem('uiLang');
  if (savedLang) {
    state.uiLang = savedLang;
    if (els.uiLanguage) els.uiLanguage.value = savedLang;
  }
} catch {}

function renderOutputMarkdown(text) {
  const html = DOMPurify.sanitize(marked.parse(text || ''));
  els.output.innerHTML = html;
  els.chatContainer.scrollTop = els.chatContainer.scrollHeight;
}

// Simple multilingual dictionary
const i18n = {
  en: {
    personalization_title: 'Personalization',
    region_label: 'Region',
    subregion_label: 'Sub-region',
    language_label: 'Language',
    ui_language_label: 'UI Language',
    domain_label: 'Domain',
    grade_label: 'Grade level',
    lowdata_label: 'Low data mode',
    illustrations_title: 'Illustrations',
    auto_see_label: 'See (auto visuals)',
    image_prompt_placeholder: 'Describe an illustration to generate...',
    generate_button: 'Generate Illustration',
    user_input_placeholder: 'Ask a question or request a lesson...',
    send_button: 'Send',
    generated_title: 'Generated Illustrations',
    // options
    domain_literacy: 'Literacy',
    domain_numeracy: 'Numeracy',
    domain_stem: 'STEM',
    domain_digital: 'Digital Literacy',
    domain_ai: 'AI Literacy',
    grade_primary: 'Primary',
    grade_middle: 'Middle',
    grade_secondary: 'Secondary',
    select_region: 'Select region',
    select_subregion: 'Select subregion',
    auto_label: 'Auto',
  },
  hi: {
    personalization_title: 'व्यक्तिकरण',
    region_label: 'क्षेत्र',
    subregion_label: 'उप-क्षेत्र',
    language_label: 'भाषा',
    ui_language_label: 'यूआई भाषा',
    domain_label: 'विषय',
    grade_label: 'कक्षा स्तर',
    lowdata_label: 'कम डाटा मोड',
    illustrations_title: 'चित्र',
    auto_see_label: 'देखें (स्वतः चित्र)',
    image_prompt_placeholder: 'बनाने के लिए चित्र का वर्णन करें...',
    generate_button: 'चित्र बनाएँ',
    user_input_placeholder: 'प्रश्न पूछें या पाठ का अनुरोध करें...',
    send_button: 'भेजें',
    generated_title: 'बने हुए चित्र',
    domain_literacy: 'साक्षरता',
    domain_numeracy: 'संख्यात्मकता',
    domain_stem: 'STEM',
    domain_digital: 'डिजिटल साक्षरता',
    domain_ai: 'एआई साक्षरता',
    grade_primary: 'प्राथमिक',
    grade_middle: 'मध्य',
    grade_secondary: 'माध्यमिक',
    select_region: 'क्षेत्र चुनें',
    select_subregion: 'उप-क्षेत्र चुनें',
    auto_label: 'स्वतः',
  },
  ar: {
    personalization_title: 'التخصيص',
    region_label: 'المنطقة',
    subregion_label: 'المنطقة الفرعية',
    language_label: 'اللغة',
    ui_language_label: 'لغة الواجهة',
    domain_label: 'المجال',
    grade_label: 'المستوى الدراسي',
    lowdata_label: 'وضع البيانات المنخفضة',
    illustrations_title: 'رسومات',
    auto_see_label: 'شاهد (رسومات تلقائية)',
    image_prompt_placeholder: 'صف الرسمة المطلوبة...',
    generate_button: 'توليد الرسمة',
    user_input_placeholder: 'اطرح سؤالاً أو اطلب درسًا...',
    send_button: 'إرسال',
    generated_title: 'الرسومات المولدة',
    domain_literacy: 'القرائية',
    domain_numeracy: 'العدديّة',
    domain_stem: 'STEM',
    domain_digital: 'المهارات الرقمية',
    domain_ai: 'ثقافة الذكاء الاصطناعي',
    grade_primary: 'ابتدائي',
    grade_middle: 'إعدادي',
    grade_secondary: 'ثانوي',
    select_region: 'اختر المنطقة',
    select_subregion: 'اختر المنطقة الفرعية',
    auto_label: 'تلقائي',
  },
  es: {
    personalization_title: 'Personalización',
    region_label: 'Región',
    subregion_label: 'Subregión',
    language_label: 'Idioma',
    ui_language_label: 'Idioma de la interfaz',
    domain_label: 'Dominio',
    grade_label: 'Nivel',
    lowdata_label: 'Modo de bajo dato',
    illustrations_title: 'Ilustraciones',
    auto_see_label: 'Ver (auto visuales)',
    image_prompt_placeholder: 'Describe una ilustración para generar...',
    generate_button: 'Generar Ilustración',
    user_input_placeholder: 'Haz una pregunta o pide una lección...',
    send_button: 'Enviar',
    generated_title: 'Ilustraciones Generadas',
    domain_literacy: 'Alfabetización',
    domain_numeracy: 'Numeracia',
    domain_stem: 'STEM',
    domain_digital: 'Alfabetización digital',
    domain_ai: 'Alfabetización en IA',
    grade_primary: 'Primaria',
    grade_middle: 'Media',
    grade_secondary: 'Secundaria',
    select_region: 'Seleccionar región',
    select_subregion: 'Seleccionar subregión',
    auto_label: 'Auto',
  },
  fr: {
    personalization_title: 'Personnalisation',
    region_label: 'Région',
    subregion_label: 'Sous-région',
    language_label: 'Langue',
    ui_language_label: 
      'Langue de l’interface',
    domain_label: 'Domaine',
    grade_label: 'Niveau',
    lowdata_label: 'Mode faible données',
    illustrations_title: 'Illustrations',
    auto_see_label: 'Voir (visuels auto)',
    image_prompt_placeholder: 'Décrivez une illustration à générer...',
    generate_button: 'Générer une illustration',
    user_input_placeholder: 'Posez une question ou demandez une leçon...',
    send_button: 'Envoyer',
    generated_title: 'Illustrations générées',
    domain_literacy: 'Littératie',
    domain_numeracy: 'Numératie',
    domain_stem: 'STEM',
    domain_digital: 'Compétences numériques',
    domain_ai: 'Culture IA',
    grade_primary: 'Primaire',
    grade_middle: 'Collège',
    grade_secondary: 'Lycée',
    select_region: 'Choisir une région',
    select_subregion: 'Choisir une sous-région',
    auto_label: 'Auto',
  },
  pt: {
    personalization_title: 'Personalização',
    region_label: 'Região',
    subregion_label: 'Sub-região',
    language_label: 'Idioma',
    ui_language_label: 'Idioma da interface',
    domain_label: 'Domínio',
    grade_label: 'Ano',
    lowdata_label: 'Modo de baixo dados',
    illustrations_title: 'Ilustrações',
    auto_see_label: 'Ver (visuais automáticos)',
    image_prompt_placeholder: 'Descreva uma ilustração para gerar...',
    generate_button: 'Gerar ilustração',
    user_input_placeholder: 'Faça uma pergunta ou peça uma aula...',
    send_button: 'Enviar',
    generated_title: 'Ilustrações geradas',
    domain_literacy: 'Letramento',
    domain_numeracy: 'Numeracia',
    domain_stem: 'STEM',
    domain_digital: 'Letramento digital',
    domain_ai: 'Letramento em IA',
    grade_primary: 'Primário',
    grade_middle: 'Médio I',
    grade_secondary: 'Médio II',
    select_region: 'Selecionar região',
    select_subregion: 'Selecionar sub-região',
    auto_label: 'Auto',
  },
  bn: {
    personalization_title: 'ব্যক্তিগতকরণ',
    region_label: 'অঞ্চল',
    subregion_label: 'উপ-অঞ্চল',
    language_label: 'ভাষা',
    ui_language_label: 'ইউআই ভাষা',
    domain_label: 'বিষয়',
    grade_label: 'শ্রেণি স্তর',
    lowdata_label: 'লো-ডাটা মোড',
    illustrations_title: 'চিত্র',
    auto_see_label: 'দেখুন (স্বয়ংক্রিয় ভিজ্যুয়াল)',
    image_prompt_placeholder: 'জেনারেট করার চিত্রটি বর্ণনা করুন...',
    generate_button: 'চিত্র তৈরি করুন',
    user_input_placeholder: 'প্রশ্ন করুন বা পাঠ চাইুন...',
    send_button: 'পাঠান',
    generated_title: 'তৈরি চিত্র',
    domain_literacy: 'সাক্ষরতা',
    domain_numeracy: 'সংখ্যাতত্ত্ব',
    domain_stem: 'এসটিইএম',
    domain_digital: 'ডিজিটাল সাক্ষরতা',
    domain_ai: 'এআই সাক্ষরতা',
    grade_primary: 'প্রাথমিক',
    grade_middle: 'মাধ্যমিক (নিম্ন)',
    grade_secondary: 'মাধ্যমিক (উচ্চ)',
    select_region: 'অঞ্চল নির্বাচন করুন',
    select_subregion: 'উপ-অঞ্চল নির্বাচন করুন',
    auto_label: 'স্বয়ং',
  },
  ta: {
    personalization_title: 'தனிப்பயன்',
    region_label: 'பகுதி',
    subregion_label: 'துணை பகுதி',
    language_label: 'மொழி',
    ui_language_label: 'UI மொழி',
    domain_label: 'துறை',
    grade_label: 'தரம்',
    lowdata_label: 'குறைந்த தரவு நிலை',
    illustrations_title: 'விளக்கப்படங்கள்',
    auto_see_label: 'பார் (தானியங்கி காட்சிகள்)',
    image_prompt_placeholder: 'உருவாக்க வேண்டிய விளக்கப்படத்தை விவரிக்கவும்...',
    generate_button: 'விளக்கப்படம் உருவாக்கு',
    user_input_placeholder: 'ஒரு கேள்வி கேளுங்கள் அல்லது பாடம் கேளுங்கள்...',
    send_button: 'அனுப்பு',
    generated_title: 'உருவாக்கப்பட்ட விளக்கப்படங்கள்',
    domain_literacy: 'எழுத்தறிவு',
    domain_numeracy: 'எண்ணறிவு',
    domain_stem: 'STEM',
    domain_digital: 'இணைய/இ-கல்வி',
    domain_ai: 'ஏஐ அறிமுகம்',
    grade_primary: 'தொடக்க',
    grade_middle: 'இடைநிலை',
    grade_secondary: 'மேய்நிலை',
    select_region: 'பகுதியைத் தேர்ந்தெடுக்கவும்',
    select_subregion: 'துணைப் பகுதியைத் தேர்ந்தெடுக்கவும்',
    auto_label: 'தானாக',
  },
  sw: {
    personalization_title: 'Ugeuzi',
    region_label: 'Kanda',
    subregion_label: 'Eneo ndogo',
    language_label: 'Lugha',
    ui_language_label: 'Lugha ya UI',
    domain_label: 'Mada',
    grade_label: 'Darasa',
    lowdata_label: 'Hali ya data ndogo',
    illustrations_title: 'Michoro',
    auto_see_label: 'Tazama (picha otomatiki)',
    image_prompt_placeholder: 'Eleza mchoro wa kutengeneza...',
    generate_button: 'Tengeneza Mchoro',
    user_input_placeholder: 'Uliza swali au omba somo...',
    send_button: 'Tuma',
    generated_title: 'Michoro Iliyoundwa',
    domain_literacy: 'Kusoma na kuandika',
    domain_numeracy: 'Hesabu',
    domain_stem: 'STEM',
    domain_digital: 'Ujuzi wa Kidijitali',
    domain_ai: 'Uelewa wa AI',
    grade_primary: 'Msingi',
    grade_middle: 'Kati',
    grade_secondary: 'Sekondari',
    select_region: 'Chagua kanda',
    select_subregion: 'Chagua eneo ndogo',
    auto_label: 'Otomatiki',
  },
  ru: {
    personalization_title: 'Персонализация',
    region_label: 'Регион',
    subregion_label: 'Подрегион',
    language_label: 'Язык',
    ui_language_label: 'Язык интерфейса',
    domain_label: 'Область',
    grade_label: 'Уровень',
    lowdata_label: 'Экономия трафика',
    illustrations_title: 'Иллюстрации',
    auto_see_label: 'Смотреть (автовизуализация)',
    image_prompt_placeholder: 'Опишите иллюстрацию...',
    generate_button: 'Создать иллюстрацию',
    user_input_placeholder: 'Задайте вопрос или запросите урок...',
    send_button: 'Отправить',
    generated_title: 'Сгенерированные иллюстрации',
    domain_literacy: 'Грамотность',
    domain_numeracy: 'Счет (числовая грамотность)',
    domain_stem: 'STEM',
    domain_digital: 'Цифровая грамотность',
    domain_ai: 'Грамотность ИИ',
    grade_primary: 'Начальная',
    grade_middle: 'Средняя',
    grade_secondary: 'Старшая',
    select_region: 'Выберите регион',
    select_subregion: 'Выберите подрегион',
    auto_label: 'Авто',
  },
  uz: {
    personalization_title: 'Moslashtirish',
    region_label: 'Hudud',
    subregion_label: 'Subhudud',
    language_label: 'Til',
    ui_language_label: 'UI tili',
    domain_label: 'Yo‘nalish',
    grade_label: 'Daraja',
    lowdata_label: 'Kam trafik rejimi',
    illustrations_title: 'Tasvirlar',
    auto_see_label: 'Ko‘rish (avto vizuallar)',
    image_prompt_placeholder: 'Tasvirni tariflang...',
    generate_button: 'Tasvir hosil qilish',
    user_input_placeholder: 'Savol bering yoki dars so‘rang...',
    send_button: 'Yuborish',
    generated_title: 'Yaratilgan tasvirlar',
    domain_literacy: 'Savodxonlik',
    domain_numeracy: 'Hisob-kitob',
    domain_stem: 'STEM',
    domain_digital: 'Raqamli savodxonlik',
    domain_ai: 'AI savodxonligi',
    grade_primary: 'Boshlang‘ich',
    grade_middle: 'O‘rta',
    grade_secondary: 'Yuqori',
    select_region: 'Hududni tanlang',
    select_subregion: 'Subhududni tanlang',
    auto_label: 'Avto',
  },
  fa: {
    personalization_title: 'شخصی‌سازی',
    region_label: 'منطقه',
    subregion_label: 'زیرمنطقه',
    language_label: 'زبان',
    ui_language_label: 'زبان رابط کاربری',
    domain_label: 'حوزه',
    grade_label: 'پایه',
    lowdata_label: 'حالت داده کم',
    illustrations_title: 'تصاویر',
    auto_see_label: 'مشاهده (تصاویر خودکار)',
    image_prompt_placeholder: 'توضیحی برای تصویر بنویسید...',
    generate_button: 'تولید تصویر',
    user_input_placeholder: 'سوال بپرسید یا درس بخواهید...',
    send_button: 'ارسال',
    generated_title: 'تصاویر تولید شده',
    domain_literacy: 'سواد خواندن و نوشتن',
    domain_numeracy: 'سواد عددی',
    domain_stem: 'STEM',
    domain_digital: 'سواد دیجیتال',
    domain_ai: 'سواد هوش مصنوعی',
    grade_primary: 'ابتدایی',
    grade_middle: 'متوسطه اول',
    grade_secondary: 'متوسطه دوم',
    select_region: 'انتخاب منطقه',
    select_subregion: 'انتخاب زیرمنطقه',
    auto_label: 'خودکار',
  },
  te: {
    personalization_title: 'వ్యక్తిగతీకరణ',
    region_label: 'ప్రాంతం',
    subregion_label: 'ఉప ప్రాంతం',
    language_label: 'భాష',
    ui_language_label: 'UI భాష',
    domain_label: 'విభాగం',
    grade_label: 'తరగతి స్థాయి',
    lowdata_label: 'తక్కువ డేటా మోడ్',
    illustrations_title: 'చిత్రాలు',
    auto_see_label: 'చూడండి (ఆటో చిత్రాలు)',
    image_prompt_placeholder: 'సృష్టించడానికి చిత్రాన్ని వివరించండి...',
    generate_button: 'చిత్రం సృష్టించు',
    user_input_placeholder: 'ప్రశ్న అడగండి లేదా పాఠాన్ని అడగండి...',
    send_button: 'పంపండి',
    generated_title: 'సృష్టించిన చిత్రాలు',
    domain_literacy: 'సాక్షరత',
    domain_numeracy: 'సంఖ్యా జ్ఞానం',
    domain_stem: 'STEM',
    domain_digital: 'డిజిటల్ సాక్షరత',
    domain_ai: 'AI సాక్షరత',
    grade_primary: 'ప్రాథమిక',
    grade_middle: 'మధ్యస్థ',
    grade_secondary: 'ద్వితీయ',
    select_region: 'ప్రాంతం ఎంచుకోండి',
    select_subregion: 'ఉప ప్రాంతం ఎంచుకోండి',
    auto_label: 'ఆటో',
  },
  kn: {
    personalization_title: 'ವೈಯಕ್ತೀಕರಣ',
    region_label: 'ಪ್ರದೇಶ',
    subregion_label: 'ಉಪಪ್ರದೇಶ',
    language_label: 'ಭಾಷೆ',
    ui_language_label: 'UI ಭಾಷೆ',
    domain_label: 'ವಿಷಯ ಕ್ಷೇತ್ರ',
    grade_label: 'ತರಗತಿ ಮಟ್ಟ',
    lowdata_label: 'ಕಡಿಮೆ ಡೇಟಾ ಮೋಡ್',
    illustrations_title: 'ಚಿತ್ರಗಳು',
    auto_see_label: 'ನೋಡಿ (ಸ್ವಯಂ ದೃಶ್ಯಗಳು)',
    image_prompt_placeholder: 'ರಚಿಸಲು ಚಿತ್ರದ ವಿವರಣೆ ನೀಡಿ...',
    generate_button: 'ಚಿತ್ರ ರಚಿಸಿ',
    user_input_placeholder: 'ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಪಾಠವನ್ನು ಕೇಳಿ...',
    send_button: 'ಕಳುಹಿಸಿ',
    generated_title: 'ರಚಿತ ಚಿತ್ರಗಳು',
    domain_literacy: 'ಸಾಕ್ಷರತೆ',
    domain_numeracy: 'ಸಂಖ್ಯಾಜ್ಞಾನ',
    domain_stem: 'STEM',
    domain_digital: 'ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತೆ',
    domain_ai: 'AI ಸಾಕ್ಷರತೆ',
    grade_primary: 'ಪ್ರಾಥಮಿಕ',
    grade_middle: 'ಮಧ್ಯಮ',
    grade_secondary: 'ಪ್ರೌಢ',
    select_region: 'ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    select_subregion: 'ಉಪಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    auto_label: 'ಸ್ವಯಂ',
  },
  mr: {
    personalization_title: 'वैयक्तिकरण',
    region_label: 'प्रदेश',
    subregion_label: 'उपप्रदेश',
    language_label: 'भाषा',
    ui_language_label: 'UI भाषा',
    domain_label: 'विषय क्षेत्र',
    grade_label: 'इयत्ता स्तर',
    lowdata_label: 'कमी डेटा मोड',
    illustrations_title: 'चित्रे',
    auto_see_label: 'पहा (स्वयंचलित दृश्य)',
    image_prompt_placeholder: 'तयार करायच्या चित्राचे वर्णन करा...',
    generate_button: 'चित्र तयार करा',
    user_input_placeholder: 'प्रश्न विचारा किंवा धडा मागा...',
    send_button: 'पाठवा',
    generated_title: 'तयार चित्रे',
    domain_literacy: 'साक्षरता',
    domain_numeracy: 'अंकज्ञान',
    domain_stem: 'STEM',
    domain_digital: 'डिजिटल साक्षरता',
    domain_ai: 'AI साक्षरता',
    grade_primary: 'प्राथमिक',
    grade_middle: 'मध्यम',
    grade_secondary: 'उच्च माध्यमिक',
    select_region: 'प्रदेश निवडा',
    select_subregion: 'उपप्रदेश निवडा',
    auto_label: 'स्वयंचलित',
  },
  gu: {
    personalization_title: 'વૈવિધ્યીકરણ',
    region_label: 'વિસ્તાર',
    subregion_label: 'ઉપવિસ્તાર',
    language_label: 'ભાષા',
    ui_language_label: 'UI ભાષા',
    domain_label: 'વિષય ક્ષેત્ર',
    grade_label: 'ધોરણ સ્તર',
    lowdata_label: 'ઓછા ડેટાનો મોડ',
    illustrations_title: 'ચિત્રો',
    auto_see_label: 'જુઓ (ઓટો વિઝ્યુઅલ્સ)',
    image_prompt_placeholder: 'બનાવવાના ચિત્રનું વર્ણન કરો...',
    generate_button: 'ચિત્ર બનાવો',
    user_input_placeholder: 'પ્રશ્ન પૂછો અથવા પાઠ માંગો...',
    send_button: 'મોકલો',
    generated_title: 'બનાવેલ ચિત્રો',
    domain_literacy: 'સાક્ષરતા',
    domain_numeracy: 'અંકજ્ઞાન',
    domain_stem: 'STEM',
    domain_digital: 'ડિજિટલ સાક્ષરતા',
    domain_ai: 'AI સાક્ષરતા',
    grade_primary: 'પ્રાથમિક',
    grade_middle: 'મધ્યમ',
    grade_secondary: 'ઉચ્ચતર',
    select_region: 'વિસ્તાર પસંદ કરો',
    select_subregion: 'ઉપવિસ્તાર પસંદ કરો',
    auto_label: 'ઓટો',
  },
  ml: {
    personalization_title: 'വ്യക്തിഗതീകരണം',
    region_label: 'മേഖല',
    subregion_label: 'ഉപമേഖല',
    language_label: 'ഭാഷ',
    ui_language_label: 'UI ഭാഷ',
    domain_label: 'വിഷയ മേഖല',
    grade_label: 'ക്ലാസ് ലെവൽ',
    lowdata_label: 'ലോ-ഡാറ്റ മോഡ്',
    illustrations_title: 'ചിത്രങ്ങൾ',
    auto_see_label: 'കാണുക (ഓട്ടോ ദൃശ്യം)',
    image_prompt_placeholder: 'സൃഷ്ടിക്കേണ്ട ചിത്രത്തെ വിവരണം ചെയ്യുക...',
    generate_button: 'ചിത്രം സൃഷ്ടിക്കുക',
    user_input_placeholder: 'ചോദ്യം ചോദിക്കൂ അല്ലെങ്കിൽ പാഠം അഭ്യർത്ഥിക്കൂ...',
    send_button: 'അയയ്ക്കൂ',
    generated_title: 'സൃഷ്ടിച്ച ചിത്രങ്ങൾ',
    domain_literacy: 'സാക്ഷരത',
    domain_numeracy: 'സംഖ്യാ ജ്ഞാനം',
    domain_stem: 'STEM',
    domain_digital: 'ഡിജിറ്റൽ സാക്ഷരത',
    domain_ai: 'AI സാക്ഷരത',
    grade_primary: 'പ്രൈമറി',
    grade_middle: 'മിഡിൽ',
    grade_secondary: 'സെക്കന്ററി',
    select_region: 'മേഖല തിരഞ്ഞെടുക്കുക',
    select_subregion: 'ഉപമേഖല തിരഞ്ഞെടുക്കുക',
    auto_label: 'ഓട്ടോ',
  },
  pa: {
    personalization_title: 'ਵਿਆਕਤੀਗਤ ਬਣਾਉ',
    region_label: 'ਖੇਤਰ',
    subregion_label: 'ਉਪ-ਖੇਤਰ',
    language_label: 'ਭਾਸ਼ਾ',
    ui_language_label: 'UI ਭਾਸ਼ਾ',
    domain_label: 'ਵਿਸ਼ਾ ਖੇਤਰ',
    grade_label: 'ਜਮਾਤ ਪੱਧਰ',
    lowdata_label: 'ਘੱਟ ਡਾਟਾ ਮੋਡ',
    illustrations_title: 'ਚਿੱਤਰ',
    auto_see_label: 'ਵੇਖੋ (ਆਟੋ ਦਰਸ਼ਨ)',
    image_prompt_placeholder: 'ਤਿਆਰ ਕਰਨ ਲਈ ਚਿੱਤਰ ਦਾ ਵਰਣਨ ਕਰੋ...',
    generate_button: 'ਚਿੱਤਰ ਬਣਾਓ',
    user_input_placeholder: 'ਪ੍ਰਸ਼ਨ ਪੁੱਛੋ ਜਾਂ ਪਾਠ ਮੰਗੋ...',
    send_button: 'ਭੇਜੋ',
    generated_title: 'ਤਿਆਰ ਕੀਤੇ ਚਿੱਤਰ',
    domain_literacy: 'ਸਾਖਰਤਾ',
    domain_numeracy: 'ਗਿਣਤੀ ਗਿਆਨ',
    domain_stem: 'STEM',
    domain_digital: 'ਡਿਜਿਟਲ ਸਾਖਰਤਾ',
    domain_ai: 'AI ਸਾਖਰਤਾ',
    grade_primary: 'ਪ੍ਰਾਇਮਰੀ',
    grade_middle: 'ਮਿਡਲ',
    grade_secondary: 'ਸਕੈਂਡਰੀ',
    select_region: 'ਖੇਤਰ ਚੁਣੋ',
    select_subregion: 'ਉਪ-ਖੇਤਰ ਚੁਣੋ',
    auto_label: 'ਆਟੋ',
  },
  or: {
    personalization_title: 'ବ୍ୟକ୍ତିଗତ କରଣ',
    region_label: 'ଅଞ୍ଚଳ',
    subregion_label: 'ଉପଅଞ୍ଚଳ',
    language_label: 'ଭାଷା',
    ui_language_label: 'UI ଭାଷା',
    domain_label: 'ବିଷୟ କ୍ଷେତ୍ର',
    grade_label: 'ଶ୍ରେଣୀ ସ୍ତର',
    lowdata_label: 'କମ୍ ତଥ୍ୟ ମୋଡ୍',
    illustrations_title: 'ଚିତ୍ର',
    auto_see_label: 'ଦେଖନ୍ତୁ (ସ୍ୱୟଂଚାଳିତ)',
    image_prompt_placeholder: 'ତିଆରି କରିବାକୁ ଚିତ୍ର ବିବରଣୀ ଦିଅନ୍ତୁ...',
    generate_button: 'ଚିତ୍ର ତିଆରି କରନ୍ତୁ',
    user_input_placeholder: 'ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ କିମ୍ବା ପାଠ ଚାହନ୍ତୁ...',
    send_button: 'ପଠାନ୍ତୁ',
    generated_title: 'ତିଆରି ହୋଇଥିବା ଚିତ୍ର',
    domain_literacy: 'ସାକ୍ଷରତା',
    domain_numeracy: 'ସଂଖ୍ୟାଜ୍ଞାନ',
    domain_stem: 'STEM',
    domain_digital: 'ଡିଜିଟାଲ ସାକ୍ଷରତା',
    domain_ai: 'AI ସାକ୍ଷରତା',
    grade_primary: 'ପ୍ରାଥମିକ',
    grade_middle: 'ମଧ୍ୟମ',
    grade_secondary: 'ଉଚ୍ଚତର',
    select_region: 'ଅଞ୍ଚଳ ବାଛନ୍ତୁ',
    select_subregion: 'ଉପଅଞ୍ଚଳ ବାଛନ୍ତୁ',
    auto_label: 'ସ୍ୱୟଂଚାଳିତ',
  },
  as: {
    personalization_title: 'ব্যক্তিগতকৰণ',
    region_label: 'অঞ্চল',
    subregion_label: 'উপ-অঞ্চল',
    language_label: 'ভাষা',
    ui_language_label: 'UI ভাষা',
    domain_label: 'বিষয় ক্ষেত্ৰ',
    grade_label: 'শ্রেণীৰ স্তৰ',
    lowdata_label: 'কম ডাটা ম’ড',
    illustrations_title: 'ছবি',
    auto_see_label: 'চাওক (অ’টো ভিজুৱেল)',
    image_prompt_placeholder: 'সৃষ্টি কৰিবলগীয়া ছবিখনৰ বিবৰণ দিয়ক...',
    generate_button: 'ছবি সৃষ্টি কৰক',
    user_input_placeholder: 'প্ৰশ্ন কৰক বা পাঠ অনুরোধ কৰক...',
    send_button: 'পঠিয়াওক',
    generated_title: 'সৃষ্টি কৰা ছবি',
    domain_literacy: 'সাক্ষৰতা',
    domain_numeracy: 'সংখ্যাজ্ঞান',
    domain_stem: 'STEM',
    domain_digital: 'ডিজিটেল সাক্ষৰতা',
    domain_ai: 'AI সাক্ষৰতা',
    grade_primary: 'প্ৰাথমিক',
    grade_middle: 'মধ্যম',
    grade_secondary: 'উচ্চতৰ',
    select_region: 'অঞ্চল বাছনি কৰক',
    select_subregion: 'উপ-অঞ্চল বাছনি কৰক',
    auto_label: 'অ’টো',
  },
  ur: {
    personalization_title: 'شخصی نوعیت',
    region_label: 'علاقہ',
    subregion_label: 'ذیلی علاقہ',
    language_label: 'زبان',
    ui_language_label: 'UI زبان',
    domain_label: 'مضمون',
    grade_label: 'درجہ',
    lowdata_label: 'کم ڈیٹا موڈ',
    illustrations_title: 'تصویریں',
    auto_see_label: 'دیکھیں (خودکار مناظر)',
    image_prompt_placeholder: 'بنائی جانے والی تصویر کی وضاحت کریں...',
    generate_button: 'تصویر بنائیں',
    user_input_placeholder: 'سوال پوچھیں یا سبق مانگیں...',
    send_button: 'بھیجیں',
    generated_title: 'تیار کردہ تصاویر',
    domain_literacy: 'خواندگی',
    domain_numeracy: 'عددی خواندگی',
    domain_stem: 'STEM',
    domain_digital: 'ڈیجیٹل خواندگی',
    domain_ai: 'اے آئی خواندگی',
    grade_primary: 'ابتدائی',
    grade_middle: 'درمیانی',
    grade_secondary: 'ثانوی',
    select_region: 'علاقہ منتخب کریں',
    select_subregion: 'ذیلی علاقہ منتخب کریں',
    auto_label: 'خودکار',
  },
  ps: {
    personalization_title: 'شخصي کول',
    region_label: 'سيمه',
    subregion_label: 'لا سيمه',
    language_label: 'ژبه',
    ui_language_label: 'د UI ژبه',
    domain_label: 'څانګه',
    grade_label: 'کچه',
    lowdata_label: 'د لږو معلوماتو حالت',
    illustrations_title: 'انځورونه',
    auto_see_label: 'وګوره (خودکار انځورونه)',
    image_prompt_placeholder: 'انځور تشريح کړئ...',
    generate_button: 'انځور توليد کړئ',
    user_input_placeholder: 'سوال وکړئ يا درس وغواړئ...',
    send_button: 'لېږل',
    generated_title: 'جوړ شوي انځورونه',
    domain_literacy: 'س識ت',
    domain_numeracy: 'شمېرپوهنه',
    domain_stem: 'STEM',
    domain_digital: 'ډيجيټل س識ت',
    domain_ai: 'د AI س識ت',
    grade_primary: 'ابتدايي',
    grade_middle: 'منځنۍ',
    grade_secondary: 'لوړه',
    select_region: 'سيمه وټاکئ',
    select_subregion: 'لا سيمه وټاکئ',
    auto_label: 'خودکار',
  },
};

function applyI18n() {
  const t = i18n[state.uiLang] || i18n.en;
  document.documentElement.lang = state.uiLang;
  const rtlLangs = new Set(['ar','ur','fa','ps']);
  document.documentElement.dir = rtlLangs.has(state.uiLang) ? 'rtl' : 'ltr';
  if (els.titlePersonalization) els.titlePersonalization.textContent = t.personalization_title;
  if (els.labelRegion) els.labelRegion.textContent = t.region_label;
  if (els.labelSubregion) els.labelSubregion.textContent = t.subregion_label;
  if (els.labelLanguage) els.labelLanguage.textContent = t.language_label;
  if (els.labelUiLanguage) els.labelUiLanguage.textContent = t.ui_language_label;
  if (els.labelDomain) els.labelDomain.textContent = t.domain_label;
  if (els.labelGrade) els.labelGrade.textContent = t.grade_label;
  if (els.labelLowData) els.labelLowData.textContent = t.lowdata_label;
  if (els.titleIllustrations) els.titleIllustrations.textContent = t.illustrations_title;
  if (els.labelAutoSee) els.labelAutoSee.textContent = t.auto_see_label;
  if (els.titleGenerated) els.titleGenerated.textContent = t.generated_title;
  if (els.imagePrompt) els.imagePrompt.placeholder = t.image_prompt_placeholder;
  if (els.userInput) els.userInput.placeholder = t.user_input_placeholder;
  if (els.genImageBtn) els.genImageBtn.textContent = t.generate_button;
  if (els.sendBtn) els.sendBtn.textContent = t.send_button;
  applyOptionI18n();
}

function applyOptionI18n() {
  const t = i18n[state.uiLang] || i18n.en;
  // Domain options (stable order)
  const domainValues = ['Literacy', 'Numeracy', 'STEM', 'Digital Literacy', 'AI Literacy'];
  const domainLabels = [t.domain_literacy, t.domain_numeracy, t.domain_stem, t.domain_digital, t.domain_ai];
  if (els.domain) {
    els.domain.innerHTML = '';
    domainValues.forEach((val, idx) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = domainLabels[idx] || val;
      els.domain.appendChild(opt);
    });
  }
  // Grade options
  const gradeValues = ['Primary', 'Middle', 'Secondary'];
  const gradeLabels = [t.grade_primary, t.grade_middle, t.grade_secondary];
  if (els.grade) {
    els.grade.innerHTML = '';
    gradeValues.forEach((val, idx) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = gradeLabels[idx] || val;
      els.grade.appendChild(opt);
    });
  }
  // Select placeholders for region/subregion and language 'Auto'
  if (els.region && els.region.options.length) {
    els.region.options[0].textContent = t.select_region || 'Select region';
  }
  if (els.subregion) {
    if (!els.subregion.options.length) {
      const opt = document.createElement('option');
      opt.value = '';
      els.subregion.appendChild(opt);
    }
    els.subregion.options[0].textContent = t.select_subregion || 'Select subregion';
  }
  if (els.language) {
    if (!els.language.options.length) {
      const opt = document.createElement('option'); opt.value=''; els.language.appendChild(opt);
    }
    els.language.options[0].textContent = t.auto_label || 'Auto';
  }
}

function populateRegions(data) {
  state.regions = data.regions || {};
  els.region.innerHTML = '<option value="">Select region</option>' + Object.keys(state.regions).map(r => `<option>${r}</option>`).join('');
  els.region.addEventListener('change', () => {
    const r = els.region.value;
    const pack = state.regions[r] || {};
    const subregions = Object.keys((pack.subregions || {}));
    els.subregion.innerHTML = '<option value="">Select subregion</option>' + subregions.map(s => `<option>${s}</option>`).join('');
    const langs = (pack.languages || []);
    els.language.innerHTML = '<option value="">Auto</option>' + langs.map(l => `<option>${l}</option>`).join('');
    applyOptionI18n();
  });
  els.subregion.addEventListener('change', () => {
    const r = els.region.value; const s = els.subregion.value;
    const pack = state.regions[r] || {}; const subPack = (pack.subregions || {})[s] || {};
    const langs = subPack.languages || pack.languages || [];
    els.language.innerHTML = '<option value="">Auto</option>' + langs.map(l => `<option>${l}</option>`).join('');
    applyOptionI18n();
  });
}

// Preset library (radio list)
const presets = {
  numeracy_mixed_fractions: {
    title: 'Numeracy: Mixed Fractions',
    domain: 'Numeracy',
    lessons: [
      'Introduce mixed fractions (like 2 1/2) using local food portions and simple visuals. Include 3-4 local examples and a short practice.',
      'Convert mixed fractions to improper fractions and back, tied to market measurements. Include 3-4 examples and 2 practice tasks.',
      'Add/subtract mixed fractions with same denominators using local contexts (e.g., rotis, cups). Include 3-4 examples and 2 practice tasks.',
      'Word problems with mixed fractions (estimation + exact). Include hints before solutions; 3 examples.',
    ],
  },
  stem_water_cycle_monsoon: {
    title: 'STEM: Water Cycle (Monsoon)',
    domain: 'STEM',
    lessons: [
      'Explain the water cycle stages focusing on monsoon climates. Use 3-4 local examples and 2 practice questions.',
      'Evaporation and condensation experiments using local materials; safety tips; 3 examples.',
      'Data table: rainfall across months; interpret and conclude; 3 examples.',
    ],
  },
  digital_whatsapp_safety: {
    title: 'Digital Literacy: WhatsApp Safety',
    domain: 'Digital Literacy',
    lessons: [
      'Recognize suspicious messages; privacy basics; report/block. Give 3 scenarios and 2 practice decisions.',
      'Two-step verification and profile privacy; show steps plainly; 3 examples.',
      'Misinformation: verify sources and images. 3 examples and a short checklist.',
    ],
  },
  ai_monsoon_forecast: {
    title: 'AI Literacy: Monsoon Forecasting',
    domain: 'AI Literacy',
    lessons: [
      'Explain how AI uses past weather data to predict rain; 3 relatable examples; one practice reflection.',
      'Bias and uncertainty in predictions; 3 examples; ask a self-check question.',
      'How local farmers benefit from forecast tools; 3 examples; simple chart reading.',
    ],
  },
};

function populatePresets() {
  if (!els.presetList) return;
  const items = Object.entries(presets).map(([key, p]) => {
    return `
      <label class="flex items-start gap-2 p-2 border rounded-xl bg-white hover:bg-slate-50 cursor-pointer">
        <input type="radio" name="preset" value="${key}" class="mt-1"> 
        <span>
          <span class="block font-medium text-slate-800">${p.title}</span>
          <span class="block text-xs text-slate-500">${p.lessons.length} lessons</span>
        </span>
      </label>`;
  }).join('');
  els.presetList.innerHTML = items;
}

function getSelectedPresetKey() {
  const el = document.querySelector('input[name="preset"]:checked');
  return el ? el.value : null;
}

async function startPreset() {
  const key = getSelectedPresetKey();
  if (!key) return;
  state.selectedPreset = key;
  state.presetIndex = 0;
  await sendPresetLesson();
}

async function nextLesson() {
  if (!state.selectedPreset) return;
  state.presetIndex = Math.min(state.presetIndex + 1, presets[state.selectedPreset].lessons.length - 1);
  await sendPresetLesson();
}

async function sendPresetLesson() {
  const preset = presets[state.selectedPreset];
  if (!preset) return;
  // set domain dropdown to preset domain (optional convenience)
  els.domain.value = preset.domain;
  const lesson = preset.lessons[state.presetIndex];
  els.userInput.value = lesson;
  await sendMessage();
}

async function fetchRegions() {
  const res = await fetch('/api/personalization/regions');
  const data = await res.json();
  populateRegions(data);
  applyI18n();
  populatePresets();
}

async function sendMessage() {
  const text = els.userInput.value.trim();
  if (!text) return;
  els.userInput.value = '';
  renderOutputMarkdown('');

  const body = {
    user_message: text,
    region: els.region.value || null,
    subregion: els.subregion.value || null,
    language: els.language.value || null,
    domain: els.domain.value || null,
    grade_level: els.grade.value || null,
    low_bandwidth: !!els.lowData.checked,
    history: state.history,
  };

  try {
    const resp = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok || !resp.body) {
      renderOutputMarkdown('Chat service unavailable.');
      return;
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value, { stream: true });
      renderOutputMarkdown(assistantText);
    }
    state.lastAssistantText = assistantText;
    // Auto-generate illustration if enabled
    if (els.autoSee && els.autoSee.checked) {
      generateAutoFromText(assistantText || text);
    }
    // Update history
    state.history = [
      ...(state.history || []),
      { role: 'user', content: text },
      { role: 'assistant', content: assistantText },
    ].slice(-20); // keep last 20 messages
  } catch (e) {
    renderOutputMarkdown('Network error.');
  }
}

async function generateImage() {
  const prompt = els.imagePrompt.value.trim();
  const body = {};
  if (prompt) {
    body.prompt = prompt;
  } else {
    // If no prompt provided, fall back to last assistant text
    const context = state.lastAssistantText || els.userInput.value.trim();
    if (!context) return;
    body.auto_from_text = context;
  }
  els.imagePrompt.value = '';
  body.region = els.region.value || null;
  body.subregion = els.subregion.value || null;
  body.language = els.language.value || null;
  const res = await fetch('/api/images/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const { images = [], text = '' } = data;
  images.forEach((url, idx) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Generated illustration';
    img.className = 'w-full h-36 object-cover rounded-xl border';
    img.addEventListener('click', () => setCurrentIllustration(url, text));
    els.gallery.prepend(img);
    if (idx === 0) setCurrentIllustration(url, text);
  });
  setCurrentIllustration(images[0], text);
}

async function generateAutoFromText(context) {
  if (!context) return;
  const body = {
    auto_from_text: context,
    region: els.region.value || null,
    subregion: els.subregion.value || null,
    language: els.language.value || null,
  };
  try {
    const res = await fetch('/api/images/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const { images = [], text = '' } = data;
    images.forEach((url, idx) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Generated illustration';
      img.className = 'w-full h-36 object-cover rounded-xl border';
      img.addEventListener('click', () => setCurrentIllustration(url, text));
      els.gallery.prepend(img);
      if (idx === 0) setCurrentIllustration(url, text);
    });
  } catch (e) {
    // ignore
  }
}

function setCurrentIllustration(url, caption) {
  if (!url) return;
  els.currentIllustration.src = url;
  els.illustrationCaption.textContent = caption || '';
}

els.sendBtn.addEventListener('click', sendMessage);
els.userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); });
els.genImageBtn.addEventListener('click', generateImage);
if (els.uiLanguage) {
  els.uiLanguage.addEventListener('change', () => {
    state.uiLang = els.uiLanguage.value || 'en';
    try { localStorage.setItem('uiLang', state.uiLang); } catch {}
    applyI18n();
  });
}

if (els.startPresetBtn) els.startPresetBtn.addEventListener('click', startPreset);
if (els.nextLessonBtn) els.nextLessonBtn.addEventListener('click', nextLesson);

fetchRegions();
