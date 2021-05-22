var api = require("../controllers/apis/Apis.js");
var runt = require("../controllers/apis/Runt.js");
var tecalliance = require("../controllers/apis/Tecalliance.js");
var blog = require("../controllers/apis/Blogs.js");
var riparoFriend = require("../controllers/apis/RiparoFriend.js");
var faq = require("../controllers/apis/Faqs.js");
var parameterPricing = require("../controllers/apis/ParameterPricing.js");
var globalSettings = require("../controllers/apis/GlobalSettings.js");
var manageSuppliers = require("../controllers/apis/Suppliers.js");
var apiToken = require("../middlewares/apiToken");

/*** WEBSITE ****/

var webAuthApi = require("../controllers/website/Auth/Apis.js");
var webArticleApi = require("../controllers/website/Articles");
var webGarageApi = require("../controllers/website/Garage");
var webCheckoutApi = require("../controllers/website/Checkout");
var webOrderApi = require("../controllers/website/Orders");
var webSupportTicket = require("../controllers/website/Support/Tickets");

/*** SUPPLIER ****/

var supplierArticleApi = require("../controllers/supplier/Articles");

module.exports = function (app) {
  /**********  AUTH APIS  ******************/

  //dashboard
  app.route("/api/admin-dashboard").get(api.getAdminDashboard);

  //login
  app.route("/api/login").post(api.logIn);

  // social login
  app.route("/api/social-login").post(api.socialLogIn);

  // logout
  app.route("/api/logout").post(apiToken, api.logOut);

  // profile
  app.route("/api/me").get(apiToken, api.getProfile);

  // profile ( token )
  app.route("/api/me/token").get(api.getProfileByToken);

  // update user content
  app.route("/api/user-content").put(apiToken, api.updateUserContent);

  // update user content
  app.route("/api/user-content-id").put(apiToken, api.updateUserContentById);

  // change password
  app.route("/api/change-password").put(apiToken, api.changePassword);

  // change password by token
  app.route("/api/change-password-token").put(api.changePasswordByToken);

  // all supplier types
  app.route("/api/all-supplier-types").get(api.allSupplierTypes);

  // all currencies
  app.route("/api/all-currencies").get(api.allCurrencies);

  // all countries
  app.route("/api/all-countries").get(api.allCountries);

  // all freight zones
  app.route("/api/freight-zones").get(api.allFreightZones);

  // add
  app.route("/api/freight-zone").post(apiToken, api.addZone);

  // update
  app.route("/api/freight-zone/:id").put(apiToken, api.updateZone);

  // delete
  app.route("/api/freight-zone/:id").delete(apiToken, api.deleteZone);

  // get
  app.route("/api/freight-zone/:id").get(apiToken, api.getZone);

  // all shipping insurances
  app.route("/api/shipping-insurances").get(api.allShippingInsurances);

  /**********  ZONE PRICING  ******************/

  // import runt db
  app.route("/api/import-zone-pricing").post(apiToken, api.importZonePricing);

  // all
  app.route("/api/zone-pricing").get(api.allZonePricing);

  /**********  ZONE COUNTRIES  ******************/

  // import runt db
  app
    .route("/api/import-zone-countries")
    .post(apiToken, api.importZoneCountries);

  // all
  app.route("/api/zone-countries").get(api.allZoneCountries);

  // add zone country
  app.route("/api/zone-countries").post(apiToken, api.addZoneCountries);

  // update zone-countries
  app.route("/api/zone-countries/:id").put(apiToken, api.updateZoneCountries);

  // get singe zone-countries
  app.route("/api/zone-countries/:id").get(apiToken, api.getZoneCountries);

  // get singe zone by country name
  app.route("/api/zone-by-countries/:id").get(api.getZoneByCountry);

  // get cat sub by name
  app.route("/api/cat-sub-name").get(api.getCatSubByName);

  // add zone pricing
  app.route("/api/zone-pricing").post(apiToken, api.addZonePricing);

  // update zone-pricing
  app.route("/api/zone-pricing/:id").put(apiToken, api.updateZonePricing);

  // get singe zone-pricing
  app.route("/api/zone-pricing/:id").get(apiToken, api.getZonePricing);

  // get singe zone-pricing by shipment
  app.route("/api/zone-pricing-shipment").get(api.getZonePricingByShipment);

  // get Article Price Cat Sub
  app.route("/api/get-article-cat-sub").get(api.getArticlePriceByCatSub);

  // get Article Price Cat Sub
  app.route("/api/get-article-cat-sub-all").get(api.getArticlePriceByCatSubAll);

  // get Article Price Cat Sub
  app
    .route("/api/get-article-cat-sub-one/:id")
    .get(api.getArticlePriceByCatSubOne);

  // update edit-article-cat-sub
  app
    .route("/api/edit-article-cat-sub/:id")
    .put(apiToken, api.updateArticlePriceByCatSub);

  // get Article Price Cat Sub
  app.route("/api/article-cat-sub").put(api.articlePriceByCatSub);

  // add insurance-pricing
  app.route("/api/insurance-pricing").post(apiToken, api.addInsurancePricing);

  // update insurance-pricing
  app
    .route("/api/insurance-pricing/:id")
    .put(apiToken, api.updateInsurancePricing);

  // get singe insurance-pricing
  app
    .route("/api/insurance-pricing/:id")
    .get(apiToken, api.getInsurancePricing);

  // get singe insurance-pricing
  app.route("/api/insurance-pricing").get(apiToken, api.allInsurancePricing);

  /**********  RIPARO FRIEND CATEGORIES  ******************/

  // add
  app.route("/api/rf-category").post(apiToken, api.addRfCategory);

  // update
  app.route("/api/rf-category/:id").put(apiToken, api.updateRfCategory);

  // delete
  app.route("/api/rf-category/:id").delete(apiToken, api.deleteRfCategory);

  // get
  app.route("/api/rf-category/:id").get(apiToken, api.getRfCategory);

  // all
  app.route("/api/all-rf-categories").get(api.allRfCategories);

  /**********  FAQS CATEGORIES  ******************/

  // add
  app.route("/api/faq-category").post(apiToken, faq.addFaqCategory);

  // update
  app.route("/api/faq-category/:id").put(apiToken, faq.updateFaqCategory);

  // delete
  app.route("/api/faq-category/:id").delete(apiToken, faq.deleteFaqCategory);

  // get
  app.route("/api/faq-category/:id").get(apiToken, faq.getFaqCategory);

  // all
  app.route("/api/all-faq-categories").get(faq.allFaqCategories);

  /**********  SLIDERS  ******************/

  // add
  app.route("/api/slider").post(apiToken, api.addSlider);

  // all
  app.route("/api/sliders").get(api.allSliders);

  /**********  SETTINGS  ******************/

  // get website content
  app.route("/api/website-content").get(api.getWebsiteContent);

  // update membership option
  app.route("/api/website-content").put(apiToken, api.updateWebsiteContent);

  //----------------------------------------------------------------------------------------------

  /**********  RUNT DATABASE  ******************/

  // import runt db
  app.route("/api/import-runt").post(apiToken, runt.importRunt);

  // all membership option
  app.route("/api/runt-db").get(runt.allRuntDb);

  //----------------------------------------------------------------------------------------------

  /**********  TECALLIANCE  ******************/

  // all categories
  app
    .route("/api/tecalliance/categories")
    .get(tecalliance.tecallianceCategories);

  // feature discount
  app.route("/api/feature/category/:id").put(tecalliance.featureCategory);

  // single categories
  app
    .route("/api/tecalliance/category/:id")
    .get(tecalliance.tecallianceCategory);

  // single sub categories
  app
    .route("/api/tecalliance/sub-category/:id")
    .get(tecalliance.tecallianceSubCategory);

  // single categories by shortcut
  app
    .route("/api/tecalliance/category-name")
    .get(tecalliance.tecallianceCategoryByName);

  // edit categories
  app
    .route("/api/tecalliance/category/:id")
    .put(tecalliance.tecallianceEditCategory);

  // edit sub categories
  app
    .route("/api/tecalliance/sub-category/:id")
    .put(tecalliance.tecallianceEditSubCategory);

  // single manu
  app.route("/api/tecalliance/manu/:id").get(tecalliance.tecallianceManu);

  // single manu by manuId
  app.route("/api/tecalliance/manuId/:id").get(tecalliance.tecallianceManuId);

  // edit categories
  app.route("/api/tecalliance/manu/:id").put(tecalliance.tecallianceEditManu);

  // all sub categories
  app
    .route("/api/tecalliance/sub-categories")
    .get(tecalliance.tecallianceSubCategories);

  // all brands
  app.route("/api/tecalliance/brands").get(tecalliance.tecallianceAmBrands);

  // single manu by brands
  app
    .route("/api/tecalliance/brands-id")
    .get(tecalliance.tecallianceAmBrandsSingle);

  // all manufacturers
  app
    .route("/api/tecalliance/manufacturers")
    .get(tecalliance.tecallianceManufacturers);

  // all model series
  app
    .route("/api/tecalliance/model-series")
    .get(tecalliance.tecallianceModelSeries);

  // tecallianceVehicleIdsByCriteria
  app
    .route("/api/tecalliance/VehicleIdsByCriteria")
    .get(tecalliance.tecallianceVehicleIdsByCriteria);

  // getLinkedVehicle
  app
    .route("/api/tecalliance/getLinkedVehicle")
    .post(tecalliance.getLinkedVehicle);

  // tecallianceArticles
  app.route("/api/tecalliance/Articles").get(tecalliance.tecallianceArticles);

  // update article price
  app
    .route("/api/tecalliance/edit-article-price/:id")
    .put(apiToken, tecalliance.editArticlePrice);

  // tecalliance get Article price
  app
    .route("/api/tecalliance/get-article-price/:id")
    .get(tecalliance.getArticlePrice);

  /**********  TEC ARTICLE PRICING  ******************/

  // import
  app
    .route("/api/import-tec-article-pricing")
    .post(apiToken, api.importTecArticlePricing);

  // import tec recommend
  app
    .route("/api/import-tec-article-recommend")
    .post(apiToken, api.importTecArticleRecommend);

  // all
  app.route("/api/tec-article-pricing").get(api.allTecArticlePricing);

  // all
  app.route("/api/tec-article-recommend").get(api.allTecArticleRecommend);

  // one
  app.route("/api/tec-article/pricing").get(api.tecArticlePricingOne);

  /**********  B L O G S  ******************/

  // add blog
  app.route("/api/blog").post(apiToken, blog.addBlog);

  // update blog
  app.route("/api/blog/:id").put(apiToken, blog.updateBlog);

  // get singe blog
  app.route("/api/blog/:id").get(blog.getBlog);

  // all blogs
  app.route("/api/blogs").get(blog.allBlogs);

  /**********  RIPARO FRIENDS  ******************/

  // add blog
  app.route("/api/riparo-friend").post(apiToken, riparoFriend.addRf);

  // update blog
  app.route("/api/riparo-friend/:id").put(apiToken, riparoFriend.updateRf);

  // get singe blog
  app.route("/api/riparo-friend/:id").get(apiToken, riparoFriend.getRf);

  // all blogs
  app.route("/api/riparo-friends").get(apiToken, riparoFriend.allRfs);

  /**********  F A Q S  ******************/

  // add faq
  app.route("/api/faq").post(apiToken, faq.addFaq);

  // update faq
  app.route("/api/faq/:id").put(apiToken, faq.updateFaq);

  // get singe faq
  app.route("/api/faq/:id").get(apiToken, faq.getFaq);

  // all faqs
  app.route("/api/faqs").get(faq.allFaqs);

  /**********  P A Y M E N T -  M E T H O D S  ******************/

  // update stripe
  app
    .route("/api/pm/update/stripe")
    .put(apiToken, parameterPricing.updateStripe);

  // update paypal
  app
    .route("/api/pm/update/paypal")
    .put(apiToken, parameterPricing.updatePaypal);

  // all payment methods
  app
    .route("/api/payment-methods")
    .get(apiToken, parameterPricing.allPaymentMethods);

  /**********  D I S C O U N T S  ******************/

  // add discount
  app.route("/api/discount").post(apiToken, parameterPricing.addDiscount);

  // update discount
  app.route("/api/discount/:id").put(apiToken, parameterPricing.updateDiscount);

  // get singe discount
  app.route("/api/discount/:id").get(apiToken, parameterPricing.getDiscount);

  // get feature discount
  app.route("/api/feature/discount").get(parameterPricing.getFeatureDiscount);

  // feature discount
  app.route("/api/feature/discount/:id").put(parameterPricing.featureDiscount);

  // all discounts
  app.route("/api/discounts").get(parameterPricing.allDiscounts);

  /**********  CUSTOM DUTIES  ******************/

  // add CustomDuties
  app
    .route("/api/custom-duties")
    .post(apiToken, parameterPricing.addCustomDuties);

  // update CustomDuties
  app
    .route("/api/custom-duties/:id")
    .put(apiToken, parameterPricing.updateCustomDuties);

  // get singe CustomDuties
  app
    .route("/api/custom-duties/:id")
    .get(apiToken, parameterPricing.getCustomDuties);

  // all CustomDuties
  app.route("/api/custom-duties").get(parameterPricing.allCustomDuties);

  /**********  C A M P A I G N S  ******************/

  // add campaign
  app.route("/api/campaign").post(apiToken, parameterPricing.addCampaign);

  // update campaign
  app.route("/api/campaign/:id").put(apiToken, parameterPricing.updateCampaign);

  // get singe campaign
  app.route("/api/campaign/:id").get(apiToken, parameterPricing.getCampaign);

  // all discounts
  app.route("/api/campaigns").get(apiToken, parameterPricing.allCampaigns);

  /**********  T A X - M A N A G E M E N T  ******************/

  // get website content
  app.route("/api/tax-mgt").get(parameterPricing.getTaxContent);

  // update membership option
  app.route("/api/tax-mgt").put(apiToken, parameterPricing.updateTaxContent);

  /**********  F R E I G H T - P R I C I N G  ******************/

  // add freight-pricing
  app
    .route("/api/freight-pricing")
    .post(apiToken, parameterPricing.addFreightPricing);

  // update freight-pricing
  app
    .route("/api/freight-pricing/:id")
    .put(apiToken, parameterPricing.updateFreightPricing);

  // get singe freight-pricing
  app
    .route("/api/freight-pricing/:id")
    .get(apiToken, parameterPricing.getFreightPricing);

  // all freight-pricings
  app
    .route("/api/freight-pricings")
    .get(apiToken, parameterPricing.allFreightPricings);

  /**********  G L O B E L -  S E T T I N G S  ******************/

  // update global setting
  app
    .route("/api/update-global-setting")
    .put(apiToken, globalSettings.updateGlobalSettings);

  // get global setting
  app
    .route("/api/global-settings")
    .get(apiToken, globalSettings.allGlobalSettings);

  // get timezones
  app.route("/api/all-timezones").get(apiToken, globalSettings.allTimezones);

  /**********  S U P P L I E R S  ******************/

  // add supplier
  app.route("/api/supplier").post(apiToken, manageSuppliers.addSupplier);

  // update supplier
  app.route("/api/supplier/:id").put(apiToken, manageSuppliers.updateSupplier);

  // get singe supplier
  app.route("/api/supplier/:id").get(apiToken, manageSuppliers.getSupplier);

  // all suppliers
  app.route("/api/suppliers").get(apiToken, manageSuppliers.allSuppliers);

  //---------------------------------------------------------------------------------------------

  // update membership option
  app.route("/api/website-content").put(apiToken, api.updateWebsiteContent);

  /**********  COMMON APIS  ******************/

  // change row status
  app.route("/api/changeRowStatus/:id").post(apiToken, api.changeRowStatus);

  // delete row
  app.route("/api/rowDelete/:id").delete(apiToken, api.rowDelete);

  /**********  Customers  ******************/
  app.route("/api/customers").get(api.getAllCustomers);
  app.route("/api/providers").get(api.getAllProviders);
  app.route("/api/edit-customer").get(api.editGetCustomer);
  app.route("/api/delete-customer").delete(api.deleteCustomer);
  app.route("/api/add-customer").post(api.addCustomer);
  app.route("/api/edit_customer").put(api.editCustomer);

  /****************************************************************************************************
					W   E   B   S   I    T    E
	******************************************************************************************************/

  // Sign Up
  app.route("/api/web/auth/sign-up").post(webAuthApi.signUp);

  // Forgot-Password
  app.route("/api/forgot-password").post(webAuthApi.forgotPassword);

  // resend code
  app.route("/api/web/auth/resend-code").put(apiToken, webAuthApi.resendCode);

  // verify code
  app.route("/api/web/auth/verify-code").post(apiToken, webAuthApi.verifyCode);

  /*
	|--------------------------------------------------------------------------
	| ARTICLES
	|------------------------------------------------------------------------ */

  // add
  app.route("/api/article/wishlist").post(apiToken, webArticleApi.wishlist);

  // get wishlist
  app.route("/api/article/wishlist").get(apiToken, webArticleApi.getWishlist);

  // delete wishlist
  app
    .route("/api/article/wishlist")
    .delete(apiToken, webArticleApi.deleteWishlist);

  // delete wishlist
  app
    .route("/api/article/single-wishlist")
    .delete(apiToken, webArticleApi.deleteSingleWishlist);

  /*************** RATING **************/

  // add
  app.route("/api/article/rating").post(webArticleApi.rating);

  // get ratings
  app.route("/api/article/all-rating").get(webArticleApi.getAllRating);

  // get ratings
  app.route("/api/article/rating").get(webArticleApi.getProductRating);

  // get ratings
  app.route("/api/article/recommend").get(webArticleApi.getProductRecommend);

  /******* QUESTION & ANSWER ( Article Single Page ) *******/

  // add
  app.route("/api/article/qa").post(apiToken, webArticleApi.askQuestion);

  // get ratings
  app.route("/api/article/all-qas").get(webArticleApi.getAllQas);

  /**********  ARTICLES F A Q S  ******************/

  // all
  app.route("/api/article-faqs").get(apiToken, api.allArticleFaqs);

  // get
  app.route("/api/article-faq/:id").get(apiToken, api.getArticleFaq);

  // get
  app.route("/api/article-faq/:id").put(apiToken, api.updateArticleFaq);

  /*
	|--------------------------------------------------------------------------
	| GARAGE
	|------------------------------------------------------------------------ */

  // add
  app.route("/api/garage").post(apiToken, webGarageApi.addGarage);

  // edit
  app.route("/api/garage").put(apiToken, webGarageApi.editGarage);

  // get wishlist
  app.route("/api/garages").get(apiToken, webGarageApi.getGarages);

  // get garage
  app.route("/api/garage/single/:id").get(apiToken, webGarageApi.getGarage);

  // delete wishlist
  app.route("/api/garage").delete(apiToken, webGarageApi.deleteGarage);

  /*
	|--------------------------------------------------------------------------
	| SUPPORT
	|------------------------------------------------------------------------ */

  // add
  app.route("/api/create/ticket").post(apiToken, webSupportTicket.addTicket);

  // get tickets
  app.route("/api/tickets").get(apiToken, webSupportTicket.getTickets);

  // get ticket chat
  app.route("/api/ticket/single").get(apiToken, webSupportTicket.getTicket);

  // get ticket
  app.route("/api/ticket").get(apiToken, webSupportTicket.getTicketDetail);

  // get ticket
  app.route("/api/close/ticket").post(apiToken, webSupportTicket.closeTicket);

  // get
  app.route("/api/send-message").post(apiToken, webSupportTicket.sendMessage);

  // contact us
  app.route("/api/contact-us").post(webSupportTicket.contactUs);

  // contact us
  app
    .route("/api/notify-availability")
    .post(webSupportTicket.notifyAvailability);

  // get tickets
  app
    .route("/api/article-price-requests")
    .get(apiToken, webSupportTicket.getArticlePriceRequests);

  /*
	|--------------------------------------------------------------------------
	| CHECKOUT
	|------------------------------------------------------------------------ */

  // add
  app.route("/api/checkout").post(apiToken, webCheckoutApi.checkout);

  // check coupon
  app.route("/api/check/coupon").post(webCheckoutApi.checkCoupon);

  /*
	|--------------------------------------------------------------------------
	| ORDERS
	|------------------------------------------------------------------------ */

  // all
  app.route("/api/orders").get(apiToken, webOrderApi.getOrders);

  // single
  app.route("/api/order-detail").get(apiToken, webOrderApi.getOrderDetail);

  /****************************************************************************************************
					S U P P L I E R S
******************************************************************************************************/

  /*
|--------------------------------------------------------------------------
| ARTICLES
|------------------------------------------------------------------------ */

  // add
  app.route("/api/article").post(apiToken, supplierArticleApi.addArticle);

  // import runt db
  app
    .route("/api/import-articles")
    .post(apiToken, supplierArticleApi.importArticles);

  // update
  app.route("/api/article/:id").put(apiToken, supplierArticleApi.updateArticle);

  // approve article
  app
    .route("/api/approve-article/:id")
    .put(apiToken, supplierArticleApi.approveArticle);

  // single
  app.route("/api/article/:id").get(supplierArticleApi.getArticle);

  // delete
  app
    .route("/api/article/:id")
    .delete(apiToken, supplierArticleApi.deleteArticle);

  // all
  app.route("/api/articles").get(supplierArticleApi.allArticles);
};
