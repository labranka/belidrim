// Central SR/EN dictionary. Keys are referenced from HTML via data-i18n="key".
// Serbian (sr) is the default language; English (en) is optional.
export const translations = {
  sr: {
    // --- Navigation ---
    'nav.home': 'Početna',
    'nav.about': 'O nama',
    'nav.gallery': 'Galerija',
    'nav.careers': 'Zaposlenje',
    'nav.contact': 'Kontakt',
    'nav.cta': 'Zatražite ponudu',
    'lang.toggleLabel': 'Promeni jezik',

    // --- Accessibility / 404 ---
    'a11y.skip': 'Pređi na sadržaj',
    'a11y.gallery': 'Galerija vozila',
    'notFound.title': 'Stranica nije pronađena',
    'notFound.text':
      'Žao nam je, tražena stranica ne postoji ili je premeštena.',
    'notFound.back': 'Nazad na početnu',

    // --- Hero (home) ---
    'hero.tagline': 'Transport bez stresa',
    'hero.subtitle':
      'Pouzdan i siguran prevoz robe u Srbiji i regionu, sa sopstvenim voznim parkom i dugogodišnjim iskustvom.',
    'hero.ctaPrimary': 'Zatražite ponudu',
    'hero.ctaSecondary': 'Saznajte više o nama',

    // --- Home: stats ---
    'stats.years': 'godina iskustva',
    'stats.trucks': 'vozila u voznom parku',
    'stats.countries': 'zemalja regiona',

    // --- Home: about preview ---
    'home.aboutEyebrow': 'Ko smo mi?',
    'home.aboutTitle': 'Porodična firma kojoj klijenti veruju',
    'home.aboutText':
      'Beli Drim je porodična transportna firma osnovana 2014. godine. Sa sopstvenim voznim parkom i timom iskusnih vozača prevozimo robu brzo, tačno i bezbedno do željene lokacije.',
    'home.aboutLink': 'Pročitajte našu priču',

    // --- Home: services ---
    'services.eyebrow': 'Šta radimo',
    'services.title': 'Naše usluge',
    'services.subtitle':
      'Kompletna logistika za vašu robu, od preuzimanja do isporuke.',
    'services.card1.title': 'Domaći transport',
    'services.card1.text':
      'Brz i pouzdan prevoz robe na teritoriji cele Srbije, uz garantovanu tačnost isporuke.',
    'services.card2.title': 'Međunarodni transport',
    'services.card2.text':
      'Prevoz robe širom regiona i Evrope, uz puno praćenje i sigurnost vaše pošiljke.',
    'services.card3.title': 'Sopstveni vozni park',
    'services.card3.text':
      'Savremeni i ekološki prihvatljivi kamioni, redovno održavani za maksimalnu pouzdanost.',

    // --- Home: CTA band ---
    'cta.title': 'Potreban vam je prevoz robe?',
    'cta.text': 'Javite nam se, naš tim je spreman da vam pruži najbolju uslugu.',
    'cta.button': 'Kontaktirajte nas',

    // --- About page ---
    'about.eyebrow': 'O nama',
    'about.title': 'Ko smo mi?',
    'about.p1':
      'Beli Drim je firma nastala 2014. godine za transport robe širom regiona vozilima iz našeg voznog parka. Osnovani smo sa ciljem da pružimo kvalitetne usluge transporta robe na teritoriji Srbije i regiona.',
    'about.p2':
      'Naša firma poseduje sopstveni vozni park, koji se sastoji od savremenih kamiona, što nam omogućava da pružimo brze i efikasne usluge transporta. Uz to, naš tim stručnjaka i vozača ima dugogodišnje iskustvo u ovom poslu, što nam omogućava da se efikasno nosimo sa svim izazovima na putu.',
    'about.p3':
      'Cilj nam je da pružimo pouzdane i sigurne usluge transporta robe našim klijentima. Bez obzira na vrstu robe, mi smo u mogućnosti da je prevezemo na željenu lokaciju u dogovorenom roku. Stavljamo veliki akcenat na tačnost i preciznost prilikom dostave, kako bi se naši klijenti mogli osloniti na nas.',
    'about.p4':
      'Uz to, posvećeni smo i zaštiti životne sredine. Naši kamioni su savremeni i ekološki prihvatljivi, što nam omogućava da smanjimo uticaj na životnu sredinu.',
    'about.p5':
      'Ukoliko vam je potreban transport robe, ne oklevajte da nas kontaktirate. Naš tim je uvek spreman da vam pruži najbolju moguću uslugu.',
    'about.valuesTitle': 'Zašto baš mi?',
    'about.value1.title': 'Pouzdanost',
    'about.value1.text': 'Isporuka na vreme, svaki put. Bez izgovora.',
    'about.value2.title': 'Iskustvo',
    'about.value2.text': 'Dugogodišnje iskustvo i tim proverenih vozača.',
    'about.value3.title': 'Sopstveni vozni park',
    'about.value3.text': 'Savremena i redovno održavana vozila.',
    'about.value4.title': 'Briga o okolini',
    'about.value4.text': 'Ekološki prihvatljivi kamioni i odgovoran pristup.',

    // --- Gallery page ---
    'gallery.eyebrow': 'Galerija',
    'gallery.title': 'Naš vozni park',
    'gallery.intro':
      'Dobrodošli u galeriju našeg voznog parka! Predstavljamo vam našu flotu savremenih vozila prilagođenih da udovolje svim potrebama naših klijenata.',

    // --- Careers page ---
    'careers.eyebrow': 'Zaposlenje',
    'careers.title': 'Pridružite se našem timu',
    'careers.intro':
      'Tražimo pouzdane i odgovorne vozače koji žele da budu deo stabilne porodične firme. Ako imate iskustvo u transportu, javite nam se.',
    'careers.openTitle': 'Otvorene pozicije',
    'careers.role1': 'Vozač kamiona (kategorije C/CE)',
    'careers.role2': 'Vozač u domaćem transportu',
    'careers.role3': 'Vozač u međunarodnom transportu',
    'careers.formTitle': 'Prijavite se',
    'careers.formNote':
      'Popunite formu i javićemo vam se u najkraćem mogućem roku.',

    // --- Contact page ---
    'contact.eyebrow': 'Kontakt',
    'contact.title': 'Kontaktirajte nas',
    'contact.intro':
      'Imate pitanje ili vam je potrebna ponuda? Tu smo za vas, javite nam se na bilo koji od načina ispod.',
    'contact.phoneLabel': 'Telefon',
    'contact.emailLabel': 'Email',
    'contact.addressLabel': 'Adresa',
    'contact.hoursLabel': 'Radno vreme',
    'contact.hoursValue': 'Ponedeljak do petka: 08 do 16h',
    'contact.formTitle': 'Pošaljite nam poruku',

    // --- Forms ---
    'form.name': 'Ime i prezime',
    'form.email': 'Email adresa',
    'form.phone': 'Broj telefona',
    'form.position': 'Pozicija za koju se prijavljujete',
    'form.message': 'Poruka',
    'form.send': 'Pošalji',
    'form.sending': 'Slanje…',
    'form.success': 'Hvala! Vaša poruka je uspešno poslata.',
    'form.error': 'Došlo je do greške. Pokušajte ponovo ili nas pozovite.',

    // --- Footer ---
    'footer.tagline':
      'Pouzdan prevoz robe u Srbiji i regionu od 2014. godine.',
    'footer.quicklinks': 'Brzi linkovi',
    'footer.contactTitle': 'Kontakt',
    'footer.legalTitle': 'Podaci o firmi',
    'footer.followTitle': 'Pratite nas',
    'footer.rights': 'Sva prava zadržana.',
    'footer.madeBy': 'Izradila',
  },

  en: {
    // --- Navigation ---
    'nav.home': 'Home',
    'nav.about': 'About us',
    'nav.gallery': 'Gallery',
    'nav.careers': 'Careers',
    'nav.contact': 'Contact',
    'nav.cta': 'Request a quote',
    'lang.toggleLabel': 'Change language',

    // --- Accessibility / 404 ---
    'a11y.skip': 'Skip to content',
    'a11y.gallery': 'Vehicle gallery',
    'notFound.title': 'Page not found',
    'notFound.text':
      "Sorry, the page you're looking for doesn't exist or has moved.",
    'notFound.back': 'Back to home',

    // --- Hero (home) ---
    'hero.tagline': 'Stress-free transport',
    'hero.subtitle':
      'Reliable and safe freight transport in Serbia and the region, with our own fleet and years of experience.',
    'hero.ctaPrimary': 'Request a quote',
    'hero.ctaSecondary': 'Learn more about us',

    // --- Home: stats ---
    'stats.years': 'years of experience',
    'stats.trucks': 'vehicles in our fleet',
    'stats.countries': 'countries in the region',

    // --- Home: about preview ---
    'home.aboutEyebrow': 'Who we are',
    'home.aboutTitle': 'A family business clients trust',
    'home.aboutText':
      'Beli Drim is a family transport company founded in 2014. With our own fleet and a team of experienced drivers, we move your goods quickly, accurately and safely to their destination.',
    'home.aboutLink': 'Read our story',

    // --- Home: services ---
    'services.eyebrow': 'What we do',
    'services.title': 'Our services',
    'services.subtitle': 'Complete logistics for your goods, from pickup to delivery.',
    'services.card1.title': 'Domestic transport',
    'services.card1.text':
      'Fast and reliable transport of goods across Serbia, with guaranteed on-time delivery.',
    'services.card2.title': 'International transport',
    'services.card2.text':
      'Transport across the region and Europe, with full tracking and the safety of your shipment.',
    'services.card3.title': 'Our own fleet',
    'services.card3.text':
      'Modern and environmentally friendly trucks, regularly maintained for maximum reliability.',

    // --- Home: CTA band ---
    'cta.title': 'Need your goods transported?',
    'cta.text': 'Get in touch, our team is ready to give you the best service.',
    'cta.button': 'Contact us',

    // --- About page ---
    'about.eyebrow': 'About us',
    'about.title': 'Who we are',
    'about.p1':
      'Beli Drim is a company founded in 2014 for the transport of goods across the region using vehicles from our own fleet. We were established with the goal of providing quality freight transport services in Serbia and the region.',
    'about.p2':
      'Our company owns its own fleet of modern trucks, which allows us to provide fast and efficient transport services. In addition, our team of experts and drivers has many years of experience in this business, which lets us efficiently handle every challenge on the road.',
    'about.p3':
      'Our goal is to provide reliable and safe freight transport to our clients. Whatever the type of goods, we are able to transport it to the desired location within the agreed deadline. We place great emphasis on accuracy and precision in delivery, so our clients can rely on us.',
    'about.p4':
      'We are also committed to protecting the environment. Our trucks are modern and environmentally friendly, which allows us to reduce our impact on nature.',
    'about.p5':
      'If you need goods transported, do not hesitate to contact us. Our team is always ready to provide you with the best possible service.',
    'about.valuesTitle': 'Why choose us?',
    'about.value1.title': 'Reliability',
    'about.value1.text': 'On-time delivery, every time. No excuses.',
    'about.value2.title': 'Experience',
    'about.value2.text': 'Years of experience and a team of proven drivers.',
    'about.value3.title': 'Our own fleet',
    'about.value3.text': 'Modern, regularly maintained vehicles.',
    'about.value4.title': 'Care for the environment',
    'about.value4.text': 'Eco-friendly trucks and a responsible approach.',

    // --- Gallery page ---
    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'Our fleet',
    'gallery.intro':
      'Welcome to the gallery of our fleet! We present our fleet of modern vehicles adapted to meet all the needs of our clients.',

    // --- Careers page ---
    'careers.eyebrow': 'Careers',
    'careers.title': 'Join our team',
    'careers.intro':
      'We are looking for reliable and responsible drivers who want to be part of a stable family business. If you have experience in transport, get in touch.',
    'careers.openTitle': 'Open positions',
    'careers.role1': 'Truck driver (category C/CE)',
    'careers.role2': 'Domestic transport driver',
    'careers.role3': 'International transport driver',
    'careers.formTitle': 'Apply now',
    'careers.formNote': 'Fill in the form and we will get back to you as soon as possible.',

    // --- Contact page ---
    'contact.eyebrow': 'Contact',
    'contact.title': 'Contact us',
    'contact.intro':
      'Have a question or need a quote? We are here for you, reach us any of the ways below.',
    'contact.phoneLabel': 'Phone',
    'contact.emailLabel': 'Email',
    'contact.addressLabel': 'Address',
    'contact.hoursLabel': 'Working hours',
    'contact.hoursValue': 'Monday to Friday: 8 am to 4 pm',
    'contact.formTitle': 'Send us a message',

    // --- Forms ---
    'form.name': 'Full name',
    'form.email': 'Email address',
    'form.phone': 'Phone number',
    'form.position': 'Position you are applying for',
    'form.message': 'Message',
    'form.send': 'Send',
    'form.sending': 'Sending…',
    'form.success': 'Thank you! Your message has been sent successfully.',
    'form.error': 'Something went wrong. Please try again or call us.',

    // --- Footer ---
    'footer.tagline': 'Reliable freight transport in Serbia and the region since 2014.',
    'footer.quicklinks': 'Quick links',
    'footer.contactTitle': 'Contact',
    'footer.legalTitle': 'Company details',
    'footer.followTitle': 'Follow us',
    'footer.rights': 'All rights reserved.',
    'footer.madeBy': 'Made by',
  },
};
