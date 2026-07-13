// Configuration
const LIMIT = 100;

function shuffleArray(array) {
    const arr = [...array]; // Create a copy to avoid mutating the original
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const locations = [
    // United States
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Boston",
    "Nashville",
    "Miami",
    "Atlanta",
    "Las Vegas",
    "Portland",
    "Detroit",
    "Minneapolis",
    "Tampa",
    "Orlando",

    // Canada
    "Toronto",
    "Vancouver",
    "Montreal",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
    "Victoria",

    // United Kingdom
    "London",
    "Birmingham",
    "Manchester",
    "Glasgow",
    "Liverpool",
    "Leeds",
    "Bristol",
    "Sheffield",
    "Edinburgh",
    "Cardiff",

    // Europe
    "Berlin",
    "Munich",
    "Frankfurt",
    "Paris",
    "Amsterdam",
    "Rotterdam",
    "Brussels",
    "Dublin",
    "Vienna",
    "Zurich",
    "Stockholm",
    "Oslo",
    "Copenhagen",
    "Helsinki",
    "Madrid",
    "Barcelona",
    "Rome",
    "Milan",
    "Lisbon",
    "Prague",

    // Australia
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Gold Coast",
    "Canberra",
    "Hobart",

    // New Zealand
    "Auckland",
    "Wellington",
    "Christchurch",
    "Hamilton",
    "Tauranga"
];


const industries = [
    "dentist",
    "dental clinic",
    "doctor",
    "medical clinic",
    "lawyer",
    "law firm",
    "accountant",
    "accounting firm",
    "financial advisor",
    "insurance agency",
    "real estate agency",
    "property management",
    "mortgage broker",
    "plumber",
    "plumbing company",
    "electrician",
    "electrical contractor",
    "HVAC contractor",
    "roofing contractor",
    "construction company",
    "builder",
    "landscaping company",
    "cleaning company",
    "pest control company",
    "physiotherapist",
    "chiropractor",
    "psychologist",
    "optometrist",
    "veterinary clinic",
    "auto repair",
    "mechanic",
    "car dealership",
    "restaurant",
    "hotel",
    "cafe",
    "architect",
    "interior designer",
    "web design company",
    "IT support company",
    "marketing agency",
    "gym",
    "fitness center",
    "beauty salon",
    "spa",
    "travel agency"
];


const patterns = [
    '{location} {industry} contact email @'
];

// 2. Generate randomized lists
const shuffledLocations = shuffleArray(locations);
const shuffledIndustries = shuffleArray(industries);

let keywords = [];

// 3. Generate keywords with limit check
outerLoop: for (const location of shuffledLocations) {
    for (const industry of shuffledIndustries) {
        for (const pattern of patterns) {
            keywords.push({
                keyword: pattern
                    .replace("{location}", location)
                    .replace("{industry}", industry)
            });

            // Stop if we reach the limit
            if (keywords.length >= LIMIT) {
                break outerLoop;
            }
        }
    }
}

module.exports = { keywords };