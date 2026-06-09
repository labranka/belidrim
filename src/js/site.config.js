// ─────────────────────────────────────────────────────────────────────────
//  EDIT YOUR BUSINESS DETAILS HERE — this is the single source of truth.
//  Replace every [PLACEHOLDER] value with the real information.
// ─────────────────────────────────────────────────────────────────────────
export const site = {
  companyName: 'BELI DRIM 2014',
  companyLegal: 'Beli Drim 2014 DOO',
  foundingYear: '2014',

  // Public site URL (no trailing slash). Used for JSON-LD structured data.
  // Change this if you move to a custom domain (then also update the absolute
  // URLs in each page's <head> canonical/og tags and in sitemap.xml).
  siteUrl: 'https://labranka.github.io/belidrim',

  // ⚠️ BEFORE GOING LIVE — replace the three [PLACEHOLDER] values below.
  // Contact — used on the Contact page and in the footer.
  phoneDisplay: '+381 65 3753999',
  phoneHref: '+381653753999',
  email: 'info@belidrim.rs', // [PLACEHOLDER] verify this mailbox is monitored
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
