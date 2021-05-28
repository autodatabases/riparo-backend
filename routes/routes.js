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
  app.route("/admin-dashboard").get(api.getAdminDashboard);

  //login
  app.route("/login").post(api.logIn);

  // social login
  app.route("/social-login").post(api.socialLogIn);

  // logout
  app.route("/logout").post(apiToken, api.logOut);

  // profile
  app.route("/me").get(apiToken, api.getProfile);

  // profile ( token )
  app.route("/me/token").get(api.getProfileByToken);

  // update user content
  app.route("/user-content").put(apiToken, api.updateUserContent);

  // update user content
  app.route("/user-content-id").put(apiToken, api.updateUserContentById);

  // change password
  app.route("/change-password").put(apiToken, api.changePassword);

  // change password by token
  app.route("/change-password-token").put(api.changePasswordByToken);

  // all supplier types
  app.route("/all-supplier-types").get(api.allSupplierTypes);

  // all currencies
  app.route("/all-currencies").get(api.allCurrencies);

  // all countries
  app.route("/all-countries").get(api.allCountries);

  // all freight zones
  app.route("/freight-zones").get(api.allFreightZones);

  // add
  app.route("/freight-zone").post(apiToken, api.addZone);

  // update
  app.route("/freight-zone/:id").put(apiToken, api.updateZone);

  // delete
  app.route("/freight-zone/:id").delete(apiToken, api.deleteZone);

  // get
  app.route("/freight-zone/:id").get(apiToken, api.getZone);

  // all shipping insurances
  app.route("/shipping-insurances").get(api.allShippingInsurances);

  /**********  ZONE PRICING  ******************/

  // import runt db
  app.route("/import-zone-pricing").post(apiToken, api.importZonePricing);

  // all
  app.route("/zone-pricing").get(api.allZonePricing);

  /**********  ZONE COUNTRIES  ******************/

  // import runt db
  app.route("/import-zone-countries").post(apiToken, api.importZoneCountries);

  // all
  app.route("/zone-countries").get(api.allZoneCountries);

  // add zone country
  app.route("/zone-countries").post(apiToken, api.addZoneCountries);

  // update zone-countries
  app.route("/zone-countries/:id").put(apiToken, api.updateZoneCountries);

  // get singe zone-countries
  app.route("/zone-countries/:id").get(apiToken, api.getZoneCountries);

  // get singe zone by country name
  app.route("/zone-by-countries/:id").get(api.getZoneByCountry);

  // get cat sub by name
  app.route("/cat-sub-name").get(api.getCatSubByName);

  // add zone pricing
  app.route("/zone-pricing").post(apiToken, api.addZonePricing);

  // update zone-pricing
  app.route("/zone-pricing/:id").put(apiToken, api.updateZonePricing);

  // get singe zone-pricing
  app.route("/zone-pricing/:id").get(apiToken, api.getZonePricing);

  // get singe zone-pricing by shipment
  app.route("/zone-pricing-shipment").get(api.getZonePricingByShipment);

  // get Article Price Cat Sub
  app.route("/get-article-cat-sub").get(api.getArticlePriceByCatSub);

  // get Article Price Cat Sub
  app.route("/get-article-cat-sub-all").get(api.getArticlePriceByCatSubAll);

  // get Article Price Cat Sub
  app.route("/get-article-cat-sub-one/:id").get(api.getArticlePriceByCatSubOne);

  // update edit-article-cat-sub
  app
    .route("/edit-article-cat-sub/:id")
    .put(apiToken, api.updateArticlePriceByCatSub);

  // get Article Price Cat Sub
  app.route("/article-cat-sub").put(api.articlePriceByCatSub);

  // add insurance-pricing
  app.route("/insurance-pricing").post(apiToken, api.addInsurancePricing);

  // update insurance-pricing
  app.route("/insurance-pricing/:id").put(apiToken, api.updateInsurancePricing);

  // get singe insurance-pricing
  app.route("/insurance-pricing/:id").get(apiToken, api.getInsurancePricing);

  // get singe insurance-pricing
  app.route("/insurance-pricing").get(apiToken, api.allInsurancePricing);

  /**********  RIPARO FRIEND CATEGORIES  ******************/

  // add
  app.route("/rf-category").post(apiToken, api.addRfCategory);

  // update
  app.route("/rf-category/:id").put(apiToken, api.updateRfCategory);

  // delete
  app.route("/rf-category/:id").delete(apiToken, api.deleteRfCategory);

  // get
  app.route("/rf-category/:id").get(apiToken, api.getRfCategory);

  // all
  app.route("/all-rf-categories").get(api.allRfCategories);

  /**********  FAQS CATEGORIES  ******************/

  // add
  app.route("/faq-category").post(apiToken, faq.addFaqCategory);

  // update
  app.route("/faq-category/:id").put(apiToken, faq.updateFaqCategory);

  // delete
  app.route("/faq-category/:id").delete(apiToken, faq.deleteFaqCategory);

  // get
  app.route("/faq-category/:id").get(apiToken, faq.getFaqCategory);

  // all
  app.route("/all-faq-categories").get(faq.allFaqCategories);

  /**********  SLIDERS  ******************/

  // add
  app.route("/slider").post(apiToken, api.addSlider);

  // all
  app.route("/sliders").get(api.allSliders);

  /**********  SETTINGS  ******************/

  // get website content
  app.route("/website-content").get(api.getWebsiteContent);

  // update membership option
  app.route("/website-content").put(apiToken, api.updateWebsiteContent);

  //----------------------------------------------------------------------------------------------

  /**********  RUNT DATABASE  ******************/

  // import runt db
  app.route("/import-runt").post(apiToken, runt.importRunt);

  // all membership option
  app.route("/runt-db").get(runt.allRuntDb);

  //----------------------------------------------------------------------------------------------

  /**********  TECALLIANCE  ******************/

  // all categories
  app.route("/tecalliance/categories").get(tecalliance.tecallianceCategories);

  // feature discount
  app.route("/feature/category/:id").put(tecalliance.featureCategory);

  // single categories
  app.route("/tecalliance/category/:id").get(tecalliance.tecallianceCategory);

  // single sub categories
  app
    .route("/tecalliance/sub-category/:id")
    .get(tecalliance.tecallianceSubCategory);

  // single categories by shortcut
  app
    .route("/tecalliance/category-name")
    .get(tecalliance.tecallianceCategoryByName);

  // edit categories
  app
    .route("/tecalliance/category/:id")
    .put(tecalliance.tecallianceEditCategory);

  // edit sub categories
  app
    .route("/tecalliance/sub-category/:id")
    .put(tecalliance.tecallianceEditSubCategory);

  // single manu
  app.route("/tecalliance/manu/:id").get(tecalliance.tecallianceManu);

  // single manu by manuId
  app.route("/tecalliance/manuId/:id").get(tecalliance.tecallianceManuId);

  // edit categories
  app.route("/tecalliance/manu/:id").put(tecalliance.tecallianceEditManu);

  // all sub categories
  app
    .route("/tecalliance/sub-categories")
    .get(tecalliance.tecallianceSubCategories);

  // all brands
  app.route("/tecalliance/brands").get(tecalliance.tecallianceAmBrands);

  // single manu by brands
  app
    .route("/tecalliance/brands-id")
    .get(tecalliance.tecallianceAmBrandsSingle);

  // all manufacturers
  app
    .route("/tecalliance/manufacturers")
    .get(tecalliance.tecallianceManufacturers);

  // all model series
  app
    .route("/tecalliance/model-series")
    .get(tecalliance.tecallianceModelSeries);

  // tecallianceVehicleIdsByCriteria
  app
    .route("/tecalliance/VehicleIdsByCriteria")
    .get(tecalliance.tecallianceVehicleIdsByCriteria);

  // getLinkedVehicle
  app.route("/tecalliance/getLinkedVehicle").post(tecalliance.getLinkedVehicle);

  // tecallianceArticles
  app.route("/tecalliance/Articles").get(tecalliance.tecallianceArticles);

  // update article price
  app
    .route("/tecalliance/edit-article-price/:id")
    .put(apiToken, tecalliance.editArticlePrice);

  // tecalliance get Article price
  app
    .route("/tecalliance/get-article-price/:id")
    .get(tecalliance.getArticlePrice);

  /**********  TEC ARTICLE PRICING  ******************/

  // import
  app
    .route("/import-tec-article-pricing")
    .post(apiToken, api.importTecArticlePricing);

  // import tec recommend
  app
    .route("/import-tec-article-recommend")
    .post(apiToken, api.importTecArticleRecommend);

  // all
  app.route("/tec-article-pricing").get(api.allTecArticlePricing);

  // all
  app.route("/tec-article-recommend").get(api.allTecArticleRecommend);

  // one
  app.route("/tec-article/pricing").get(api.tecArticlePricingOne);

  /**********  B L O G S  ******************/

  // add blog
  app.route("/blog").post(apiToken, blog.addBlog);

  // update blog
  app.route("/blog/:id").put(apiToken, blog.updateBlog);

  // get singe blog
  app.route("/blog/:id").get(blog.getBlog);

  // all blogs
  app.route("/blogs").get(blog.allBlogs);

  /**********  RIPARO FRIENDS  ******************/

  // add blog
  app.route("/riparo-friend").post(apiToken, riparoFriend.addRf);

  // update blog
  app.route("/riparo-friend/:id").put(apiToken, riparoFriend.updateRf);

  // get singe blog
  app.route("/riparo-friend/:id").get(apiToken, riparoFriend.getRf);

  // all blogs
  app.route("/riparo-friends").get(apiToken, riparoFriend.allRfs);

  /**********  F A Q S  ******************/

  // add faq
  app.route("/faq").post(apiToken, faq.addFaq);

  // update faq
  app.route("/faq/:id").put(apiToken, faq.updateFaq);

  // get singe faq
  app.route("/faq/:id").get(apiToken, faq.getFaq);

  // all faqs
  app.route("/faqs").get(faq.allFaqs);

  /**********  P A Y M E N T -  M E T H O D S  ******************/

  // update stripe
  app.route("/pm/update/stripe").put(apiToken, parameterPricing.updateStripe);

  // update paypal
  app.route("/pm/update/paypal").put(apiToken, parameterPricing.updatePaypal);

  // all payment methods
  app
    .route("/payment-methods")
    .get(apiToken, parameterPricing.allPaymentMethods);

  /**********  D I S C O U N T S  ******************/

  // add discount
  app.route("/discount").post(apiToken, parameterPricing.addDiscount);

  // update discount
  app.route("/discount/:id").put(apiToken, parameterPricing.updateDiscount);

  // get singe discount
  app.route("/discount/:id").get(apiToken, parameterPricing.getDiscount);

  // get feature discount
  app.route("/feature/discount").get(parameterPricing.getFeatureDiscount);

  // feature discount
  app.route("/feature/discount/:id").put(parameterPricing.featureDiscount);

  // all discounts
  app.route("/discounts").get(parameterPricing.allDiscounts);

  /**********  CUSTOM DUTIES  ******************/

  // add CustomDuties
  app.route("/custom-duties").post(apiToken, parameterPricing.addCustomDuties);

  // update CustomDuties
  app
    .route("/custom-duties/:id")
    .put(apiToken, parameterPricing.updateCustomDuties);

  // get singe CustomDuties
  app
    .route("/custom-duties/:id")
    .get(apiToken, parameterPricing.getCustomDuties);

  // all CustomDuties
  app.route("/custom-duties").get(parameterPricing.allCustomDuties);

  /**********  C A M P A I G N S  ******************/

  // add campaign
  app.route("/campaign").post(apiToken, parameterPricing.addCampaign);

  // update campaign
  app.route("/campaign/:id").put(apiToken, parameterPricing.updateCampaign);

  // get singe campaign
  app.route("/campaign/:id").get(apiToken, parameterPricing.getCampaign);

  // all discounts
  app.route("/campaigns").get(apiToken, parameterPricing.allCampaigns);

  /**********  T A X - M A N A G E M E N T  ******************/

  // get website content
  app.route("/tax-mgt").get(parameterPricing.getTaxContent);

  // update membership option
  app.route("/tax-mgt").put(apiToken, parameterPricing.updateTaxContent);

  /**********  F R E I G H T - P R I C I N G  ******************/

  // add freight-pricing
  app
    .route("/freight-pricing")
    .post(apiToken, parameterPricing.addFreightPricing);

  // update freight-pricing
  app
    .route("/freight-pricing/:id")
    .put(apiToken, parameterPricing.updateFreightPricing);

  // get singe freight-pricing
  app
    .route("/freight-pricing/:id")
    .get(apiToken, parameterPricing.getFreightPricing);

  // all freight-pricings
  app
    .route("/freight-pricings")
    .get(apiToken, parameterPricing.allFreightPricings);

  /**********  G L O B E L -  S E T T I N G S  ******************/

  // update global setting
  app
    .route("/update-global-setting")
    .put(apiToken, globalSettings.updateGlobalSettings);

  // get global setting
  app.route("/global-settings").get(apiToken, globalSettings.allGlobalSettings);

  // get timezones
  app.route("/all-timezones").get(apiToken, globalSettings.allTimezones);

  /**********  S U P P L I E R S  ******************/

  // add supplier
  app.route("/supplier").post(apiToken, manageSuppliers.addSupplier);

  // update supplier
  app.route("/supplier/:id").put(apiToken, manageSuppliers.updateSupplier);

  // get singe supplier
  app.route("/supplier/:id").get(apiToken, manageSuppliers.getSupplier);

  // all suppliers
  app.route("/suppliers").get(apiToken, manageSuppliers.allSuppliers);

  //---------------------------------------------------------------------------------------------

  // update membership option
  app.route("/website-content").put(apiToken, api.updateWebsiteContent);

  /**********  COMMON APIS  ******************/

  // change row status
  app.route("/changeRowStatus/:id").post(apiToken, api.changeRowStatus);

  // delete row
  app.route("/rowDelete/:id").delete(apiToken, api.rowDelete);

  /**********  Customers  ******************/
  app.route("/customers").get(api.getAllCustomers);
  app.route("/providers").get(api.getAllProviders);
  app.route("/edit-customer").get(api.editGetCustomer);
  app.route("/delete-customer").delete(api.deleteCustomer);
  app.route("/add-customer").post(api.addCustomer);
  app.route("/edit_customer").put(api.editCustomer);

  /****************************************************************************************************
					W   E   B   S   I    T    E
	******************************************************************************************************/

  // Sign Up
  app.route("/web/auth/sign-up").post(webAuthApi.signUp);

  // Forgot-Password
  app.route("/forgot-password").post(webAuthApi.forgotPassword);

  // resend code
  app.route("/web/auth/resend-code").put(apiToken, webAuthApi.resendCode);

  // verify code
  app.route("/web/auth/verify-code").post(apiToken, webAuthApi.verifyCode);

  /*
	|--------------------------------------------------------------------------
	| ARTICLES
	|------------------------------------------------------------------------ */

  // add
  app.route("/article/wishlist").post(apiToken, webArticleApi.wishlist);

  // get wishlist
  app.route("/article/wishlist").get(apiToken, webArticleApi.getWishlist);

  // delete wishlist
  app.route("/article/wishlist").delete(apiToken, webArticleApi.deleteWishlist);

  // delete wishlist
  app
    .route("/article/single-wishlist")
    .delete(apiToken, webArticleApi.deleteSingleWishlist);

  /*************** RATING **************/

  // add
  app.route("/article/rating").post(webArticleApi.rating);

  // get ratings
  app.route("/article/all-rating").get(webArticleApi.getAllRating);

  // get ratings
  app.route("/article/rating").get(webArticleApi.getProductRating);

  // get ratings
  app.route("/article/recommend").get(webArticleApi.getProductRecommend);

  /******* QUESTION & ANSWER ( Article Single Page ) *******/

  // add
  app.route("/article/qa").post(apiToken, webArticleApi.askQuestion);

  // get ratings
  app.route("/article/all-qas").get(webArticleApi.getAllQas);

  /**********  ARTICLES F A Q S  ******************/

  // all
  app.route("/article-faqs").get(apiToken, api.allArticleFaqs);

  // get
  app.route("/article-faq/:id").get(apiToken, api.getArticleFaq);

  // get
  app.route("/article-faq/:id").put(apiToken, api.updateArticleFaq);

  /*
	|--------------------------------------------------------------------------
	| GARAGE
	|------------------------------------------------------------------------ */

  // add
  app.route("/garage").post(apiToken, webGarageApi.addGarage);

  // edit
  app.route("/garage").put(apiToken, webGarageApi.editGarage);

  // get wishlist
  app.route("/garages").get(apiToken, webGarageApi.getGarages);

  // get garage
  app.route("/garage/single/:id").get(apiToken, webGarageApi.getGarage);

  // delete wishlist
  app.route("/garage").delete(apiToken, webGarageApi.deleteGarage);

  /*
	|--------------------------------------------------------------------------
	| SUPPORT
	|------------------------------------------------------------------------ */

  // add
  app.route("/create/ticket").post(apiToken, webSupportTicket.addTicket);

  // get tickets
  app.route("/tickets").get(apiToken, webSupportTicket.getTickets);

  // get ticket chat
  app.route("/ticket/single").get(apiToken, webSupportTicket.getTicket);

  // get ticket
  app.route("/ticket").get(apiToken, webSupportTicket.getTicketDetail);

  // get ticket
  app.route("/close/ticket").post(apiToken, webSupportTicket.closeTicket);

  // get
  app.route("/send-message").post(apiToken, webSupportTicket.sendMessage);

  // contact us
  app.route("/contact-us").post(webSupportTicket.contactUs);

  // contact us
  app.route("/notify-availability").post(webSupportTicket.notifyAvailability);

  // get tickets
  app
    .route("/article-price-requests")
    .get(apiToken, webSupportTicket.getArticlePriceRequests);

  /*
	|--------------------------------------------------------------------------
	| CHECKOUT
	|------------------------------------------------------------------------ */

  // add
  app.route("/checkout").post(apiToken, webCheckoutApi.checkout);

  // check coupon
  app.route("/check/coupon").post(webCheckoutApi.checkCoupon);

  /*
	|--------------------------------------------------------------------------
	| ORDERS
	|------------------------------------------------------------------------ */

  // all
  app.route("/orders").get(apiToken, webOrderApi.getOrders);

  // single
  app.route("/order-detail").get(apiToken, webOrderApi.getOrderDetail);

  /****************************************************************************************************
					S U P P L I E R S
******************************************************************************************************/

  /*
|--------------------------------------------------------------------------
| ARTICLES
|------------------------------------------------------------------------ */

  // add
  app.route("/article").post(apiToken, supplierArticleApi.addArticle);

  // import runt db
  app
    .route("/import-articles")
    .post(apiToken, supplierArticleApi.importArticles);

  // update
  app.route("/article/:id").put(apiToken, supplierArticleApi.updateArticle);

  // approve article
  app
    .route("/approve-article/:id")
    .put(apiToken, supplierArticleApi.approveArticle);

  // single
  app.route("/article/:id").get(supplierArticleApi.getArticle);

  // delete
  app.route("/article/:id").delete(apiToken, supplierArticleApi.deleteArticle);

  // all
  app.route("/articles").get(supplierArticleApi.allArticles);
};
