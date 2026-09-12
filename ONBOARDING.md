# Recura - Multi-Niche Onboarding Specifications & Input Field Reference

This document provides a comprehensive, structured reference for all onboarding workflows across the **6 supported business niches** in Recura. It details the global onboarding funnel, step-by-step phases, and every required and optional input field with a single-line explanation formatted into clean tables.

---

## 1. Global End-to-End Onboarding Funnel

The onboarding process guides new users from account registration through niche customization to live payment gateway connection.

| Step | Screen / Route | Purpose | Next Action |
| :--- | :--- | :--- | :--- |
| **Step 1** | `/sign-up` | Collects user profile credentials (Full Name, Email, Password) and terms agreement. | Sends 6-digit verification code to email |
| **Step 2** | `/verify-email` | Validates email address with the 6-digit OTP code to prevent fraudulent registrations. | Redirects to Choose Business |
| **Step 3** | `/choose-business` | User selects 1 of 6 business niches to tailor invoicing templates, billing models, and forms. | Redirects to `/business-details?type=<niche>` |
| **Step 4** | `/business-details` | Multi-phase dynamic form collecting identity, tax/CAC verification, operations, and pricing. | Redirects to Connect Payment |
| **Step 5** | `/connect-payment` | Connects payment providers (Flutterwave, Paystack, Monnify, Stripe) for automated billing. | Redirects to Completion Summary |
| **Step 6** | `/completion-summary` | Summary review of configured workspace, default plans, and direct launch into `/dashboard`. | Activates workspace dashboard |

---

## 2. Niche 1: SaaS Business (`saas`)

Tailored for software platforms charging recurring monthly or annual subscriptions.

### Phase & Input Field Reference Table

| Phase | Field Name (`id`) | Field Type | Requirement | Single-Line Explanation | Example / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Basics** | Business Name (`businessName`) | Text | Required | The public legal or brand name of your SaaS product. | `Acme SaaS Inc.` |
| | Logo Upload (`logo`) | File (Image) | Optional | Brand mark used on client invoices and receipts (PNG, JPG, SVG up to 2MB). | `logo.png` |
| | Website URL (`websiteUrl`) | URL | Optional | Public website or web app domain where customers access your service. | `https://acmesaas.com` |
| **Phase 2: Verify Your Business** | Registration Number (`registrationNumber`) | Text | Optional | Official government company registration or CAC identifier for compliance. | `RC-1234567` |
| | Country of Registration (`country`) | Country Select | Required | Primary legal country where your company is incorporated and pays tax. | `United States`, `Nigeria`, etc. |
| | Business Email (`businessEmail`) | Email | Required | Designated billing and corporate contact email for platform communication. | `billing@acmesaas.com` |
| **Phase 3: How You Bill** | Billing Model (`billingModel`) | Select | Required | Core pricing model used to charge your customers for software access. | `Flat price`, `Per-user`, `Usage-based`, `Tiered` |
| | Average Price Per Customer (`avgPricePerCustomer`) | Number | Required | Expected average monthly dollar amount spent by a typical customer. | `99` |
| | Billing Frequency (`billingFrequency`) | Select | Required | Invoicing intervals available to customers (Monthly, Yearly, or Both). | `Monthly`, `Yearly`, `Both` |
| **Phase 4: Your Scale** | Active Customers (`activeCustomers`) | Number | Required | Total number of paying subscribers currently using your SaaS platform. | `150` |
| | Team Size (`teamSize`) | Number | Required | Number of internal employees and team members working in your company. | `8` |
| | Monthly Inquiries (`monthlyInquiries`) | Number | Required | Estimated volume of support tickets and sales inquiries received per month. | `60` |
| **Phase 5: Revenue Snapshot** | Monthly Revenue (`monthlyRevenue`) | Number | Required | Current estimated monthly recurring revenue (MRR) in USD. | `15000` |
| | Yearly Revenue (`yearlyRevenue`) | Number | Required | Estimated annual recurring revenue (ARR) in USD, auto-calculated from MRR. | `180000` |

---

## 3. Niche 2: Agency & Retainers (`agencies`)

Tailored for digital, design, marketing, and engineering agencies charging client retainers or per-project fees.

### Phase & Input Field Reference Table

| Phase | Field Name (`id`) | Field Type | Requirement | Single-Line Explanation | Example / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Basics** | Agency Name (`agencyName`) | Text | Required | The public brand or trading name of your agency firm. | `Apex Creative Agency` |
| | Logo Upload (`logo`) | File (Image) | Optional | Agency logo used on client proposals, retainers, and billing statements. | `agency-logo.svg` |
| | Website URL (`websiteUrl`) | URL | Optional | Agency portfolio or website URL showcasing your client work. | `https://apexagency.co` |
| **Phase 2: Verify Your Business** | Registration Number (`registrationNumber`) | Text | Optional | Official corporate business registration or incorporation number. | `RC-9876543` |
| | Country of Registration (`country`) | Country Select | Required | Legal jurisdiction where your agency is registered and issues contracts. | `United Kingdom`, `United States`, etc. |
| | Business Email (`businessEmail`) | Email | Required | Agency contact email for client contracts, invoicing, and communications. | `contracts@apexagency.co` |
| **Phase 3: Your Services** | Services Offered (`servicesList`) | Repeatable List | Required | Main client services provided by your agency team (add multiple entries). | `Web Design`, `SEO`, `Branding` |
| **Phase 4: How You Bill Clients** | Billing Structure (`billingStructure`) | Select | Required | Primary payment model used to invoice clients for professional services. | `Monthly retainer`, `Per project`, `Hourly` |
| | Average Retainer / Project Value (`avgRetainerValue`) | Number | Required | Typical dollar contract amount billed per client engagement or retainer cycle. | `3500` |
| | Typical Contract Length (`contractLength`) | Select | Required | Standard contract agreement duration agreed upon with your clients. | `Monthly`, `Quarterly`, `Ongoing`, `Fixed / One-time` |
| **Phase 5: Your Client Base** | Active Clients (`activeClients`) | Number | Required | Number of clients currently on active retainer or project contracts. | `12` |
| | Team Size (`teamSize`) | Number | Required | Total number of employees, designers, and developers on your agency staff. | `15` |
| | New Client Inquiries Monthly (`newClientInquiries`) | Number | Required | Average number of inbound sales leads and project inquiries each month. | `25` |
| **Phase 6: Revenue Snapshot** | Monthly Revenue (`monthlyRevenue`) | Number | Required | Average gross monthly revenue generated across all client retainers. | `42000` |
| | Yearly Revenue (`yearlyRevenue`) | Number | Required | Projected annual agency revenue in USD, auto-calculated from monthly earnings. | `504000` |

---

## 4. Niche 3: Social Media Marketing (`social_media`)

Tailored for social media marketing agencies, content creators, and campaign managers.

### Phase & Input Field Reference Table

| Phase | Field Name (`id`) | Field Type | Requirement | Single-Line Explanation | Example / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Basics** | Business Name (`businessName`) | Text | Required | The public name of your social media agency or marketing brand. | `Apex Social Media Co.` |
| | Logo Upload (`logo`) | File (Image) | Optional | Brand mark placed on campaign reports, client invoices, and receipts. | `social-logo.png` |
| | Website URL (`websiteUrl`) | URL | Optional | Social agency website or link-in-bio page displaying marketing services. | `https://apexsocial.co` |
| **Phase 2: Verify Your Business** | Registration Number (`registrationNumber`) | Text | Optional | Official company registration number for tax and business verification. | `REG-8839201` |
| | Country of Registration (`country`) | Country Select | Required | Jurisdiction where your social marketing business is legally registered. | `Canada`, `Nigeria`, `United States` |
| | Business Email (`businessEmail`) | Email | Required | Official business email used for client proposals and invoice deliveries. | `hello@apexsocial.co` |
| **Phase 3: Your Services** | Services Offered (`servicesList`) | Repeatable List | Required | Social marketing services offered (e.g. Instagram Management, Content Creation). | `Ad Campaigns`, `Content Creation` |
| **Phase 4: Reach & Billing** | Billing Structure (`billingStructure`) | Select | Required | Method used to bill clients for social campaigns and management work. | `Monthly retainer`, `Per campaign`, `Per project` |
| | Active Clients (`activeClients`) | Number | Required | Total number of active client accounts or brands currently managed. | `8` |
| | Average Monthly Fee Per Client (`avgFeePerClient`) | Number | Required | Average monthly dollar fee charged to each client for social management. | `2500` |
| **Phase 5: Revenue Snapshot** | Monthly Revenue (`monthlyRevenue`) | Number | Required | Current gross monthly revenue generated from social media marketing clients. | `20000` |
| | Yearly Revenue (`yearlyRevenue`) | Number | Required | Estimated annual revenue in USD, auto-computed from monthly client billing. | `240000` |

---

## 5. Niche 4: High-Growth Startup (`startups`)

Tailored for early-stage and venture-backed startups navigating product validation, funding rounds, and rapid scaling.

### Phase & Input Field Reference Table

| Phase | Field Name (`id`) | Field Type | Requirement | Single-Line Explanation | Example / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Basics** | Startup Name (`startupName`) | Text | Required | The brand or corporate legal name of your technology startup. | `Nova AI Technologies` |
| | Logo Upload (`logo`) | File (Image) | Optional | Startup brand mark used across investor updates and product billing. | `startup-logo.svg` |
| | Website URL (`websiteUrl`) | URL | Optional | Web landing page or product domain where users sign up. | `https://nova.ai` |
| **Phase 2: Verify Your Business** | Registration Number (`registrationNumber`) | Text | Optional | State incorporation or corporate filing number for banking and compliance. | `ST-001928` |
| | Country of Registration (`country`) | Country Select | Required | Legal country of incorporation (e.g. Delaware C-Corp, UK Ltd, Nigeria Ltd). | `United States`, `Estonia`, etc. |
| | Business Email (`businessEmail`) | Email | Required | Primary corporate email used by the founders and management team. | `founders@nova.ai` |
| **Phase 3: Your Stage** | Funding Stage (`fundingStage`) | Select | Required | Current investment status and fundraising round of your startup. | `Pre-seed`, `Seed`, `Series A+`, `Bootstrapped` |
| | Pricing Model (`pricingModel`) | Select | Required | Product monetization strategy used to convert users into paying customers. | `Freemium`, `Free trial`, `Usage-based` |
| **Phase 4: Your Product** | Product Description (`productDesc`) | Textarea | Required | Concise summary explaining what your product does and the problem it solves. | `AI workflow automation for engineering teams` |
| | Industry Category (`industry`) | Text | Required | High-level market vertical and technological category of your product. | `Developer Tools / AI` |
| **Phase 5: Your Team** | Team Size (`teamSize`) | Number | Required | Total number of full-time and part-time team members in the company. | `6` |
| | Hiring Status (`isHiring`) | Toggle | Required | Indicates whether your startup is actively recruiting new employees. | `Yes, hiring`, `No` |
| **Phase 6: Your Traction** | Free / Trial Users (`trialUsers`) | Number | Required | Number of registered non-paying users currently testing your product. | `1200` |
| | Paying Customers (`payingCustomers`) | Number | Required | Number of converted paying customers generating recurring revenue (can be 0). | `45` |
| | Monthly Signups (`monthlySignups`) | Number | Required | Number of new user registrations and waitlist additions acquired monthly. | `350` |
| **Phase 7: Funding So Far** | Amount Raised (`amountRaised`) | Number | Optional | Cumulative total venture capital or angel funding raised to date in USD. | `250000` |
| | Investor Count (`investorCount`) | Number | Optional | Total number of angel investors, funds, or venture syndicates on your cap table. | `3` |
| **Phase 8: Revenue Snapshot** | Monthly Revenue (`monthlyRevenue`) | Number | Required | Current monthly revenue in USD (can be 0 for pre-monetization startups). | `4500` |
| | Yearly Revenue (`yearlyRevenue`) | Number | Required | Annualized revenue run rate in USD, auto-calculated from monthly income. | `54000` |

---

## 6. Niche 5: E-Commerce & Marketplaces (`marketplaces`)

Features dynamic branching at Phase 4 depending on whether the merchant sells their own products or operates a multi-vendor platform.

### Phase & Input Field Reference Table

| Phase | Field Name (`id`) | Field Type | Requirement | Single-Line Explanation | Example / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Basics** | Store / Platform Name (`marketplaceName`) | Text | Required | The public store or marketplace platform brand name. | `TradeHub Store` |
| | Logo Upload (`logo`) | File (Image) | Optional | Merchant logo displayed on checkout receipts, orders, and packing slips. | `store-logo.png` |
| | Website URL (`websiteUrl`) | URL | Optional | Live online store URL or storefront platform domain. | `https://tradehub.com` |
| **Phase 2: Verify Your Business** | Registration Number (`registrationNumber`) | Text | Optional | Official merchant business registration or tax identification number. | `MK-449102` |
| | Country of Registration (`country`) | Country Select | Required | Legal jurisdiction where your retail business is registered for commerce tax. | `United States`, `United Kingdom`, etc. |
| | Business Email (`businessEmail`) | Email | Required | Customer support and merchant billing email address. | `sellers@tradehub.com` |
| **Phase 3: How Do You Sell?** | Sales Model (`sellModel`) | Radio Cards | Required | Chooses between single-merchant storefront and multi-vendor marketplace. | `I sell my own products` (`own`), `I host multiple sellers` (`marketplace`) |
| **Phase 4 (Branch A: Own Products)** | Platforms (`platforms`) | Checkbox Group | Required | E-commerce channels and storefront software where your products are listed. | `Shopify`, `My own website`, `Amazon` (Coming soon), `Walmart` (Coming soon) |
| | Product Types (`productTypes`) | Repeatable List | Required | Categories of physical or digital products sold in your catalog. | `Bags`, `Apparel`, `Electronics` |
| | Catalog Size (`catalogSize`) | Number | Required | Total count of distinct product SKUs currently active in your store inventory. | `120` |
| | Monthly Orders (`monthlyOrders`) | Number | Required | Average number of successful customer purchase orders completed per month. | `450` |
| **Phase 4 (Branch B: Multi-Vendor)** | Take Rate / Commission (`takeRate`) | Number (%) | Required | Percentage fee your platform retains from every vendor transaction. | `10` (keeps 10% cut) |
| | Payout Frequency (`payoutFrequency`) | Select | Required | Disbursement schedule for paying earned sales balances to platform sellers. | `Weekly`, `Monthly` |
| | Active Sellers (`activeSellers`) | Number | Required | Total number of registered active merchants selling goods on your platform. | `80` |
| **Phase 5: Revenue Snapshot** | Monthly Revenue (`monthlyRevenue`) | Number | Required | Total monthly gross merchandise value (GMV) or gross store sales in USD. | `25000` |
| | Yearly Revenue (`yearlyRevenue`) | Number | Required | Estimated annual revenue in USD, auto-computed from monthly sales volume. | `300000` |

---

## 7. Niche 6: Custom / Something Else (`other`)

Tailored for specialized service providers, consultants, hybrid firms, and custom business models.

### Phase & Input Field Reference Table

| Phase | Field Name (`id`) | Field Type | Requirement | Single-Line Explanation | Example / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Basics** | Business Name (`businessName`) | Text | Required | The public brand or registered company name of your custom business. | `Acme Services LLC` |
| | Logo Upload (`logo`) | File (Image) | Optional | Company logo used on all generated invoices, estimates, and receipts. | `logo.png` |
| | Website URL (`websiteUrl`) | URL | Optional | Official company website or portfolio link. | `https://acme.com` |
| **Phase 2: Verify Your Business** | Registration Number (`registrationNumber`) | Text | Optional | Official business registration number for corporate identification. | `REG-123456` |
| | Country of Registration (`country`) | Country Select | Required | Legal country where your enterprise is officially established. | `United States`, `Germany`, etc. |
| | Business Email (`businessEmail`) | Email | Required | Designated business email address for accounting and client inquiries. | `hello@acme.com` |
| **Phase 3: What You Do** | Description of Business (`businessDesc`) | Textarea | Required | Brief summary explaining your specialized services or custom business operations. | `Real estate agency specializing in luxury sales and advisory` |
| | Services or Offerings (`offeringsList`) | Repeatable List | Required | Key offerings, products, or custom packages provided to clients. | `Property Sales`, `Advisory` |
| **Phase 4: Your Customers** | Active Clients / Customers (`activeClients`) | Number | Required | Current number of active accounts, clients, or repeat buyers. | `25` |
| | Typical Payment Method (`paymentMethod`) | Select | Required | Standard payment frequency and contract arrangement with clients. | `Per project or job`, `Recurring`, `One-time payments`, `Mixed` |
| | Team Size (`teamSize`) | Number | Required | Total number of people employed on your team or within your practice. | `5` |
| **Phase 5: Revenue Snapshot** | Monthly Revenue (`monthlyRevenue`) | Number | Required | Average gross monthly revenue generated by your business in USD. | `10000` |
| | Yearly Revenue (`yearlyRevenue`) | Number | Required | Estimated annual gross revenue in USD, auto-calculated from monthly earnings. | `120000` |

---

## 8. Summary Comparison Matrix Across All Niches

| Niche | Total Phases | Special Custom Fields | Key Differentiation |
| :--- | :--- | :--- | :--- |
| **SaaS** | 5 Phases | Billing model, per-user pricing, MRR & ARR auto-calculator | Focused on recurring subscriber count and software usage tiers. |
| **Agencies** | 6 Phases | Repeatable services list, retainer length, project billing | Tailored for client retainers, contract deliverables, and team bandwidth. |
| **Social Media** | 5 Phases | Repeatable services list, monthly client fees, campaign pricing | Optimized for creator agencies managing monthly client social accounts. |
| **Startups** | 8 Phases | Funding stage, cap table investors, hiring toggle, product category | Tracks investor capital, traction metrics, free trials, and growth velocity. |
| **E-Commerce** | 5 Phases | Dynamic branching (Own Store vs Multi-Vendor Marketplace) | Configures SKU catalog & Shopify channels OR take-rate commission & payouts. |
| **Custom** | 5 Phases | Custom business description, repeatable offerings list, payment style | Flexible billing and client setup for hybrid and non-standard businesses. |
