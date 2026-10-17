**Title:** Salesforce Certified B2C Commerce Developer Exam Guide

**Source:** [https://help.salesforce.com/s/articleView?id=005298941&type=1](https://help.salesforce.com/s/articleView?id=005298941&type=1)

---

# Page Structure Map
```text
Salesforce Certified B2C Commerce Developer Exam Guide
├── Contents
├── About the Salesforce Certified B2C Commerce Developer Exam
├── Audience Description: Salesforce Certified B2C Commerce Developer
├── Purpose of This Exam Guide
├── About the Exam
├── Exam Outline
├── Recommended Training and Resources
├── Salesforce Certification Candidate Code of Conduct
└── Maintaining Your Salesforce Certification
```

---

## 

## Contents

About the Salesforce Certified B2C Commerce Developer Exam  
Audience Description: Salesforce Certified B2C Commerce Developer  
Purpose of This Exam Guide  
About the Exam  
Exam Outline  
Recommended Training and Resources  
Salesforce Certification Candidate Code of Conduct  
Maintaining Your Salesforce Certification

## About the Salesforce Certified B2C Commerce Developer Exam

The Salesforce Certified B2C Commerce Developer Exam is designed for individuals who have experience as developers for Salesforce B2C Commerce Digital. This exam is targeted toward Salesforce customers, partners, and employees who want to demonstrate their knowledge and skills in using B2C Commerce to develop an ecommerce solution, such as:

-   Implementing and using Storefront Reference Architecture (SFRA).
-   Creating cartridges to add reusable functionality to a site.
-   Creating, using, and modifying JavaScript controllers to add business logic to a site.
-   Creating reusable code using ISML templates.
-   Using Content Slots or Page Designer to improve the appearance and flexibility of a site.
-   Using the Forms Framework to control the validation, rendering, and storing of consumer-entered values.
-   Using the B2C Commerce APIs to modify business logic in the site.
-   Using jobs to create batch processes on system or custom objects.
-   Using Open Commerce API (OCAPI) to customize business logic.
-   Integrating with third-party systems with B2C Commerce asynchronous and synchronous methods as appropriate for the business need.
-   Creating code and configuring sites to ensure sites can scale while continuing to perform optimally.
-   Using appropriate tools to troubleshoot issues with code or configuration of a site, as well as optimize site performance.

## Audience Description: Salesforce Certified B2C Commerce Developer

The Salesforce Certified B2C Commerce Developer Exam is designed for ecommerce developers who have a minimum of 1 year of developer experience, plus 3-6 months of experience in a B2C Commerce Developer role.

The Salesforce Certified B2C Commerce Developer candidate has the knowledge, skills, and experience outlined below,

-   Describe the architecture of B2C Commerce.
-   Describe how the elements of a B2C Commerce site interact, including storefront catalogs, master catalogs, categories, inventory, promotions, products, price books, cart, and checkout. 
-   Describe the elements contained within SFRA (structure, page types, page generation, search, cart/checkout, templates, CSS), and how they're impacted when there's an update to either SFRA or B2C Commerce.
-   Design, discover, and build an ecommerce site using Salesforce B2C Commerce.
-   Install SFRA sample site and download its code.
-   Determine when custom coding or using provided functionality is more appropriate, based on an understanding of the components in SFRA and code according to the SFRA.
-   Use Business Manager to manage an ecommerce site, such as code versioning, site development, data/site import and export, global and custom preferences for all sites and organization.
-   Install and use an integrated development environment (IDE) to create, modify, and upload site code.
-   Use REST-based API to leverage OCAPI, including resources, URLs, methods, and hooks.
-   Create code using ISML templates.
-   Create custom objects and understand when creating custom objects is appropriate.
-   Write B2C Commerce script in script files to write business logic.
-   Use appropriate tools to troubleshoot issues with code or configuration of a site as well as optimize site performance.
-   Use Node and Git.
-   Create and manage jobs using B2C Commerce best practices to import/export data (for example, catalog, orders, inventory, system objects) to merge, delete, update, or replace objects.

Typical job roles of a Salesforce Certified B2C Commerce Developer candidate may include:

-   Front-End Developer
-   Full Stack Developer
-   Software Developer
-   Java or JavaScript Programmer
-   Web Application Developer
-   Support Engineer

## Purpose of This Exam Guide

This exam guide is designed to help you prepare for the Salesforce Certified B2C Commerce Developer Exam. This guide provides information about the target audience, the recommended training and documentation, and a complete list of exam objectives. Salesforce highly recommends a combination of on-the-job experience and self-study to maximize your chances of passing the exam. 

## About the Exam

Here are details about the Salesforce Certified B2C Commerce Developer Exam.

-   Content: 60 multiple-choice questions and up to five unscored questions
-   Time allotted to complete the exam: 105 minutes
-   Passing score: 65%
-   Version: Exam questions align to the Spring '23 release
-   Registration fee: US$200, JPY 30,000, plus applicable taxes as required per local law
-   Retake fee: US$100, JPY 15,000, plus applicable taxes as required per local law
-   Delivery options: Proctored exam delivered onsite at a testing center or in an online environment; find more information on scheduling an exam here. 
-   References: No hard-copy or online materials may be referenced during the exam.
-   Prerequisite: None

This exam may contain up to five additional unscored questions to gather performance data. Unscored questions are randomly integrated and have no impact on your final exam result. 

## Exam Outline

The Salesforce Certified B2C Commerce Developer Exam measures a candidate’s knowledge and skills related to the following objectives.   
 

**B2C Commerce Setup: 11%**

-   Given a sandbox environment, configure an IDE to use WebDAV to deploy cartridges to the correct version directories.
-   Given a sandbox instance and data import files, import files using the Business Manager Import/Export modules.
-   Given the code for a storefront site, add the correct sequence of cartridge names to the provided cartridge path.
-   Given a sandbox environment, use the Business Manager to add a new site to the instance, configuring the default currency and taxation type according to business requirements.
-   Given a recently created B2C site, assign the storefront data configurations according to business requirements. 

**Work With a B2C Site: 12%**

-   Given a Business Manager task, work with the product data model to manage products and product search model, their categorization, and associated inventory and pricebooks.
-   Given a configuration for tasks, such as payment and shipping information, use Business Manager to enable shoppers to complete storefront orders.
-   Given a configuration task, use Business Manager to work with Content Assets, Page Designer, Content Slots, and Content Folders.

**Data Management Using Business Manager Usage: 24%**

-   Given a business requirement, modify site search preferences and settings to enable searching for a specified term or product attribute.
-   Given a business requirement, create and configure a new search refinement and sorting definition that can be used on the storefront.
-   Given a debugging requirement or code, configure the logging categories and access the logs in Business Manager.
-   Given business requirements, extend the storefront to expose a new attribute on an existing system object type.
-   Given a business need to store custom data, determine if a custom object is needed and create and configure as required.
-   Given a problem or performance issue and data, use relevant tools to inspect code performance and determine and implement solutions (cache configuration, profilers, etc.) to resolve this issue.
-   Given a specification and a sandbox instance, configure OCAPI permissions for Data and Shop APIs.
-   Given a service configuration, recognize how they are applicable to the development process.

**Application Development: 53%**

-   Given a development task, code ISML templates that use functionality, such as local include, remote include, components, and other ISML tags.
-   Use debugging best practices and techniques to troubleshoot scripts and controllers and verify outcomes.
-   Given a requirement, create and extend the functionality of a JavaScript controller that leverages models, decorators, factories, or helpers following API best practices, and renders a template or returns a JSON response.
-   Given a business requirement and design for a new marketing page, develop page types and components to allow a marketer to build a page with the Page Designer tool.
-   Given a requirement to accept, validate, and persist information from a storefront customer, modify the appearance of a form, add validation and cross-site request forgery (CSRF) protection, and use bindings to process fields.
-   Given localization requirements, implement and enhance templates, form definitions, static files, properties files, and persistent object attributes to ensure that pages are displayed in the expected language.
-   Given a logging task and existing configuration, write code that logs non-sensitive data to custom log files with different log levels.
-   Integrate, deploy, and use a service instance based on a given requirement.
-   Given a use case, extend functionality or capture an event using hook extension points.
-   Given code that violates documented best practices, identify the issues and modify the code to conform with best practices including performance and scalability.
-   Given a business requirement, use OCAPI Shop and Data APIs to enable interoperability with an external system.
-   Given a business requirement to perform a scheduled task, develop jobs and code job scripts.

## Recommended Training and Resources

As preparation for this exam, we recommend a combination of hands-on experience, training course completion, Trailhead Trails, and self-study in the areas listed in the Exam Outline section of this exam guide. 

The self-study materials recommended for this exam include:

-   Salesforce B2C Commerce Documentation
-   Trail: Introduction to Business Manager
    -   Salesforce B2C Commerce for Developers module
    -   Salesforce B2C Commerce Launch Readiness module
-   Trail: Develop for Salesforce B2C Commerce
    -   Salesforce B2C Commerce for Developers module
    -   Architecture of Salesforce B2C Commerce module
    -   Tools & Resources for Salesforce B2C Commerce Developers module
    -   Salesforce B2C Commerce Cartridges module
    -   Headless Commerce Basics module
-   Trail: Build Your Ecommerce Site with Salesforce B2C Commerce
    -   Salesforce B2C Commerce Import & Export module
    -   Salesforce B2C Commerce Scheduled Jobs module
    -   Salesforce B2C Commerce Page Designer for Developers module
    -   B2C Commerce Storefront Implementation module
-   Trail: B2C Commerce Basics

To continue developing your Salesforce skill set, visit Trailhead Academy to enroll in expert-led courses.  
The courses recommended for this exam include:

-   B2C Commerce Developer with SFRA (CCD102)
-   Manage and Merchandise a B2C Commerce Store (CCM101)

Additional Resources:

-   SFRA - Architecture Deep Dive

To review online documentation, tip sheets, and user guides, search for the topics listed in the Exam Outline section of this guide on Salesforce Help and study the information related to those topics. 

## Salesforce Certification Candidate Code of Conduct

At Salesforce, Trust is our #1 value. Protecting the security of Salesforce Certifications is up to all of us. As a participant in the Salesforce Certification Program, you’re required to review and accept the terms of the Salesforce Certification Program Agreement and Code of Conduct at the beginning of each exam.

## Maintaining Your Salesforce Certification

One of the benefits of holding a Salesforce Certification is always being up to date on new product releases. You'll be required to complete the Salesforce Certified B2C Commerce Developer certification maintenance badge on Trailhead once a year.

**Don’t let your hard-earned certification expire!** If you don't complete all maintenance requirements by the due date, your certification will expire.

Bookmark these useful resources for maintaining your certifications.

-   Overall Maintenance Requirements
-   Maintenance Badge Due Dates
-   Verify Your Certification Status
-   Certification Expiration Details