# PacePot

PacePot is a static savings planner for short-term goals. It runs fully in the browser, with no sign-up flow and no server required.

## Entry Point

The site entry point is:

```text
index.html
```

## Run Locally

Open `index.html` directly in a browser, or use any simple static server.

## Deploy To Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the framework preset as **Other**.
5. Leave the build command empty.
6. Leave the output directory empty.
7. Deploy.

## Data Storage

Planner data is stored in the user's browser using `localStorage`. There is no backend database.

## Google Analytics 4

Google Analytics 4 has been added using this Measurement ID:

```text
G-0P34GS77N3
```

The setup lives in:

```text
analytics-config.js
analytics.js
```

To replace the Measurement ID in future, open `analytics-config.js` and update:

```js
window.PACEPOT_GA_MEASUREMENT_ID = "G-0P34GS77N3";
```

PacePot only sends generic events such as `goal_created`, `goal_updated`, `contribution_added`, `main_calculator_used`, and `seo_page_viewed`. It does not send goal names, amounts, or personal financial values.

## Google Search Console

In `index.html` and the SEO landing pages, replace:

```html
<meta name="google-site-verification" content="PASTE_VERIFICATION_CODE_HERE">
```

with the verification code from Google Search Console.

After deployment, submit this sitemap in Search Console:

```text
https://pacepot.com/sitemap.xml
```

## SEO Pages

The deployment includes these SEO landing pages:

```text
/holiday-savings-calculator
/car-savings-calculator
/house-deposit-savings-calculator
/emergency-fund-calculator
/wedding-savings-calculator
```
