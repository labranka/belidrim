// ─────────────────────────────────────────────────────────────────────────
//  EDIT YOUR BUSINESS DETAILS HERE — this is the single source of truth.
//  Replace every [PLACEHOLDER] value with the real information.
// ─────────────────────────────────────────────────────────────────────────
export const site = {
  companyName: 'BELI DRIM 2014',
  companyLegal: 'Beli Drim 2014 DOO',

  // Contact — used on the Contact page and in the footer.
  phoneDisplay: '+381 63 000 0000', // [PLACEHOLDER] e.g. +381 63 123 4567
  phoneHref: '+38163000000', // [PLACEHOLDER] same number, digits only, with country code
  email: 'info@belidrim.rs', // [PLACEHOLDER]
  address: 'IV Crnogorska 30g, Kraljevo, Srbija', // full street address

  // Map: no API key needed. Put the same address (or a Google Maps "place" query) here.
  mapQuery: 'IV Crnogorska 30g, Kraljevo, Srbija',

  // Social links — leave '' to hide the icon.
  social: {
    facebook: '', // [PLACEHOLDER] full URL, e.g. https://facebook.com/...
    instagram: '', // [PLACEHOLDER]
  },

  // Web3Forms access key (free): create one at https://web3forms.com using your email.
  // Until you paste a real key, form submissions will show an error.
  web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY', // [PLACEHOLDER]
};

// Built from mapQuery — embeds Google Maps with no API key required.
export const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.mapQuery
)}&z=13&output=embed`;
