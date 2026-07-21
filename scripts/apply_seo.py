"""Apply shared SEO, favicon, Open Graph, and JSON-LD to all index.html pages."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://www.alphataxconsultants.com"
ORG = {
    "@type": "Organization",
    "@id": f"{BASE_URL}/#organization",
    "name": "Alpha Tax Consultants",
    "url": BASE_URL + "/",
    "logo": f"{BASE_URL}/images/alpha-tax-logo.png",
    "email": "info@alphataxconsultants.com",
    "telephone": "+91-99406-66015",
    "slogan": "Your Compliance, Our Commitment.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No. 13/15, 2nd Floor, Lakshmi Nagar, Arcot Road, Porur",
        "addressLocality": "Chennai",
        "postalCode": "600116",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN",
    },
    "sameAs": [],
}

LOCAL_BUSINESS = {
    "@type": "AccountingService",
    "@id": f"{BASE_URL}/#localbusiness",
    "name": "Alpha Tax Consultants",
    "image": f"{BASE_URL}/images/alpha-tax-logo.png",
    "url": BASE_URL + "/",
    "telephone": "+91-99406-66015",
    "email": "info@alphataxconsultants.com",
    "priceRange": "$$",
    "address": ORG["address"],
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 13.038199,
        "longitude": 80.16535,
    },
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
            "opens": "09:00",
            "closes": "19:00",
        }
    ],
    "areaServed": {"@type": "Country", "name": "India"},
    "parentOrganization": {"@id": f"{BASE_URL}/#organization"},
}

FAQ_HOME = {
    "@type": "FAQPage",
    "@id": f"{BASE_URL}/#faq",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What services does Alpha Tax Consultants provide?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Alpha Tax Consultants provides GST registration and filing, TDS and income tax filing, ROC (MCA) compliance, PF and ESI registration and returns, company incorporation (Private Limited, LLP, OPC, and more), and licences such as FSSAI, MSME, trade mark, and import-export registration across India.",
            },
        },
        {
            "@type": "Question",
            "name": "Where is Alpha Tax Consultants located?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The office is at No. 13/15, 2nd Floor, Lakshmi Nagar, Arcot Road, Porur, Chennai - 600 116, Tamil Nadu, India.",
            },
        },
        {
            "@type": "Question",
            "name": "How do I contact Alpha Tax Consultants?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Call +91 99406 66015 or email info@alphataxconsultants.com. Business hours are Monday to Saturday, 9:00 AM to 7:00 PM IST.",
            },
        },
        {
            "@type": "Question",
            "name": "Does Alpha Tax Consultants serve clients outside Chennai?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. The firm offers pan-India support for registrations and statutory filings, with documentation and filing handled remotely where permitted by law.",
            },
        },
    ],
}

GLOBAL_KEYWORDS = (
    "Alpha Tax Consultants, tax consultant Chennai, GST filing India, company registration, "
    "TDS filing, ROC filing, PF ESI compliance, Porur Chennai"
)


def page_url(rel: Path) -> str:
    if rel.name == "index.html" and rel.parent == ROOT:
        return BASE_URL + "/"
    rel_path = rel.relative_to(ROOT).as_posix()
    return f"{BASE_URL}/{rel_path}"


def page_keywords(title: str) -> str:
    if "|" in title:
        topic = title.split("|", 1)[0].strip()
        if topic.lower().startswith("alpha tax"):
            return GLOBAL_KEYWORDS
        return f"{topic}, {GLOBAL_KEYWORDS}"
    return GLOBAL_KEYWORDS


def seo_block(title: str, description: str, canonical: str) -> str:
    keywords = page_keywords(title)
    desc_esc = description.replace('"', "&quot;")
    title_esc = title.replace('"', "&quot;")
    og_image = f"{BASE_URL}/images/alpha-tax-logo.png"
    return f"""  <!-- seo:alpha -->
  <meta name="keywords" content="{keywords}" />
  <meta name="author" content="Alpha Tax Consultants" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="{canonical}" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:site_name" content="Alpha Tax Consultants" />
  <meta property="og:title" content="{title_esc}" />
  <meta property="og:description" content="{desc_esc}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="{og_image}" />
  <meta property="og:image:alt" content="Alpha Tax Consultants logo" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{title_esc}" />
  <meta name="twitter:description" content="{desc_esc}" />
  <meta name="twitter:image" content="{og_image}" />
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt — site summary for AI systems" />"""


def json_ld_graph(path: Path, title: str, description: str, canonical: str) -> str:
    graph: list[dict] = [
        ORG,
        LOCAL_BUSINESS,
        {
            "@type": "WebSite",
            "@id": f"{BASE_URL}/#website",
            "url": BASE_URL + "/",
            "name": "Alpha Tax Consultants",
            "description": "Tax, GST, compliance, and company registration services in India.",
            "publisher": {"@id": f"{BASE_URL}/#organization"},
            "inLanguage": "en-IN",
        },
    ]

    is_home = path.parent == ROOT and path.name == "index.html"
    if is_home:
        graph.append(FAQ_HOME)
        graph.append(
            {
                "@type": "WebPage",
                "@id": f"{canonical}#webpage",
                "url": canonical,
                "name": title,
                "description": description,
                "isPartOf": {"@id": f"{BASE_URL}/#website"},
                "about": {"@id": f"{BASE_URL}/#organization"},
            }
        )
    else:
        service_name = title.split("|")[0].strip() if "|" in title else title
        crumbs = [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL + "/"},
        ]
        if "about" in path.parts:
            crumbs.append(
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "About Us",
                    "item": f"{BASE_URL}/about/index.html",
                }
            )
        else:
            crumbs.append(
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": service_name,
                    "item": canonical,
                }
            )
        graph.append(
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical}#breadcrumb",
                "itemListElement": crumbs,
            }
        )
        graph.append(
            {
                "@type": "Service",
                "@id": f"{canonical}#service",
                "name": service_name,
                "description": description,
                "url": canonical,
                "provider": {"@id": f"{BASE_URL}/#organization"},
                "areaServed": {"@type": "Country", "name": "India"},
            }
        )
        graph.append(
            {
                "@type": "WebPage",
                "@id": f"{canonical}#webpage",
                "url": canonical,
                "name": title,
                "description": description,
                "isPartOf": {"@id": f"{BASE_URL}/#website"},
                "about": {"@id": f"{canonical}#service"},
            }
        )

    payload = {"@context": "https://schema.org", "@graph": graph}
    return (
        '  <script type="application/ld+json">\n'
        + json.dumps(payload, indent=2, ensure_ascii=False)
        + "\n  </script>"
    )


def apply_file(path: Path) -> None:
    html = path.read_text(encoding="utf-8")
    if "<!-- seo:alpha -->" in html:
        return

    title_m = re.search(r"<title>(.*?)</title>", html, re.DOTALL)
    desc_m = re.search(
        r'<meta name="description" content="([^"]*)"', html, re.DOTALL
    )
    if not title_m or not desc_m:
        print(f"skip (missing title/description): {path}")
        return

    title = re.sub(r"\s+", " ", title_m.group(1).strip())
    description = desc_m.group(1).strip()
    canonical = page_url(path)

    block = seo_block(title, description, canonical)
    html = re.sub(
        r'(<meta name="description" content="[^"]*"\s*/>)',
        r"\1\n" + block,
        html,
        count=1,
    )

    ld = json_ld_graph(path, title, description, canonical)
    html = html.replace("</head>", ld + "\n</head>", 1)
    path.write_text(html, encoding="utf-8")
    print(f"updated: {path.relative_to(ROOT)}")


def main() -> None:
    for path in sorted(ROOT.rglob("index.html")):
        apply_file(path)


if __name__ == "__main__":
    main()
