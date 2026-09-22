const LIMIT = 5;

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Large African cities, ordered approximately by urban population.
const south_africa=["Cape Town","Johannesburg","Durban","Pretoria","Port Elizabeth","Bloemfontein","East London","Pietermaritzburg","Benoni","Tembisa","Vereeniging","Boksburg","Welkom","Mthatha","Polokwane","Middelburg","Nelspruit","Kimberley","Rustenburg","George","Paarl","Polokwane","Witbank","Vanderbijlpark","Krugersdorp","Centurion","Roodepoort","Soweto","Sandton","Randburg","Midrand","Springs","Germiston","Alberton","Brakpan","Kempton Park","Ekurhuleni","Klerksdorp","Potchefstroom","Mahikeng","Phalaborwa","Thohoyandou","Louis Trichardt","Tzaneen","Mokopane","Giyani","Musina","Mbombela","White River","Secunda","Ermelo","Standerton","Bethal","Mthatha","Qonce","Bhisho","King William's Town","Gqeberha","Jeffreys Bay","Knysna","Mossel Bay","Oudtshoorn","Worcester","Stellenbosch","Somerset West","Bellville","Paarl","Malmesbury","Vredenburg","Saldanha","Hermanus","Swellendam","Beaufort West","Upington","Kuruman","Springbok","De Aar","Colesberg","Maseru","Mthatha","Newcastle","Ladysmith","Richards Bay","Empangeni","Ulundi","Dundee","Estcourt","Howick","Kokstad","Port Shepstone","Margate","Ballito","Umhlanga","Pinetown","Chatsworth","Phoenix","KwaMashu","Pietermaritzburg","Ladysmith","Vryheid","Welkom","Sasolburg","Virginia","Kroonstad","Bethlehem","Clarens","Harrismith","QwaQwa","Ficksburg","Ladybrand","Thaba Nchu","Botshabelo","Phuthaditjhaba","Mafikeng"];

const botswana=["Gaborone","Francistown","Molepolole","Maun","Serowe","Kanye","Mahalapye","Mochudi","Lobatse","Tlokweng","Ramotswa","Thamaga","Gabane","Mogoditshane","Mmopane","Kgatleng","Palapye","Tonota","Selebi-Phikwe","Jwaneng","Kasane","Ghanzi","Kang","Letlhakane","Orapa","Bobonong","Tshabong","Hukuntsi","Tsabong","Mmadinare","Tutume","Nata","Pandamatenga","Sowa Town","Moshupa","Otse","Molepolole","Letlhakeng","Kopong","Metsemotlhabe","Metsimotlhabe","Boatle","Mmankgodi","Otse","Pilane","Mochudi","Mahalapye","Shoshong","Pitsane","Goodhope","Mmathethe","Lentsweletau","Metsimotlhabe","Gabane","Nkoyaphiri","Oodi","Modipane","Pilane","Mmathubudukwane","Artesia","Palla Road","Dibete","Mahalapye","Palapye","Tati Siding","Ramokgonami","Shakawe","Sepopa","Gumare","Maun","Mopipi","Rakops","Gweta","Nokaneng","Mohembo","Kasane","Kazungula","Pandamatenga","Francistown","Tati River","Tonota","Masunga","Tshesebe","Ramokgwebana","Tati Siding","Bobonong","Selibe Phikwe","Mmadinare","Moshupa","Kanye","Jwaneng","Lobatse","Otse","Ramatlabama","Tshabong","Bokaa","Kgatleng","Mochudi","Oodi","Tlokweng","Gaborone"];

const namibia=["Windhoek","Walvis Bay","Swakopmund","Oshakati","Rundu","Katima Mulilo","Rehoboth","Otjiwarongo","Keetmanshoop","Ondangwa","Gobabis","Tsumeb","Lüderitz","Okahandja","Mariental","Outjo","Opuwo","Ongwediva","Henties Bay","Usakos","Karasburg","Grootfontein","Otavi","Okakarara","Eenhana","Ruacana","Khorixas","Omaruru","Karibib","Aranos","Aroab","Bethanie","Aus","Berseba","Warmbad","Oranjemund","Arandis","Kalkfeld","Kamanjab","Sesriem","Solitaire","Maltahöhe","Helmeringhausen","Aus","Berseba","Noordoewer","Grünau","Seeheim","Aminuis","Leonardville","Stampriet","Hoachanas","Gochas","Dordabis","Aminuis","Witvlei","Omitara","Okahandja","Otjiwarongo","Otavi","Tsumeb","Grootfontein","Kombat","Groot Aub","Khomasdal","Katutura","Dorado Park","Klein Windhoek","Brakwater","Oshakati","Ongwediva","Ondangwa","Ongongo","Omuthiya","Outapi","Ruacana","Eenhana","Okongo","Opuwo","Kamanjab","Sesfontein","Khorixas","Outjo","Palmwag","Tsumkwe","Grootfontein","Rundu","Divundu","Bagani","Kavango","Katima Mulilo","Ngoma","Bukalo","Kongola","Lianshulu","Mongu","Walvis Bay","Swakopmund","Henties Bay","Arandis","Usakos","Karibib","Omaruru","Uis","Cape Cross","Lüderitz","Oranjemund","Keetmanshoop","Mariental","Rehoboth","Gobabis","Aminuis","Stampriet"];

const zimbabwe=["Harare","Bulawayo","Chitungwiza","Mutare","Gweru","Kwekwe","Kadoma","Masvingo","Chinhoyi","Marondera","Norton","Chegutu","Bindura","Zvishavane","Victoria Falls","Hwange","Beitbridge","Redcliff","Rusape","Karoi","Kariba","Chiredzi","Chipinge","Shurugwi","Murehwa","Ruwa","Epworth","Chivhu","Gokwe","Mberengwa","Plumtree","Lupane","Binga","Gwanda","Esigodini","Beitbridge","Mutoko","Guruve","Shamva","Mazowe","Glendale","Concession","Mvurwi","Banket","Zvimba","Darwendale","Kadoma","Mhondoro","Ngezi","Chegutu","Norton","Seke","Chitungwiza","Ruwa","Marondera","Murehwa","Mutoko","Nyanga","Juliasdale","Nyazura","Rusape","Chipinge","Chiredzi","Triangle","Lowveld","Masvingo","Chiredzi","Mwenezi","Gutu","Bikita","Chivi","Zvishavane","Shurugwi","Mberengwa","Gweru","Kwekwe","Redcliff","Shangani","Lalapanzi","Zhombe","Nkayi","Lupane","Hwange","Victoria Falls","Kamativi","Dete","Bulawayo","Plumtree","Figtree","Tsholotsho","Kezi","Gwanda","Esigodini","Plumtree","Beitbridge","Rutenga","Chiredzi","Kariba","Binga","Muzarabani","Centenary","Mount Darwin","Guruve","Shamva","Bindura","Mazowe","Glendale","Mvurwi","Chinhoyi","Karoi","Kariba","Makonde","Banket","Darwendale","Zvimba","Norton","Ruwa","Epworth","Chitungwiza"];

const kenya=["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Ruiru","Kikuyu","Thika","Malindi","Kitale","Garissa","Kakamega","Nyeri","Machakos","Meru","Lodwar","Kisii","Embu","Nanyuki","Naivasha","Kericho","Bungoma","Busia","Homa Bay","Migori","Mumias","Voi","Kilifi","Lamu","Isiolo","Marsabit","Wajir","Mandera","Narok","Bomet","Nyahururu","Chuka","Murang'a","Kiambu","Limuru","Githurai","Kasarani","Kangundo","Makueni","Wote","Taveta","Mariakani","Ukunda","Diani","Kwale","Msambweni","Kilgoris","Awasi","Ahero","Siaya","Bondo","Kakuma","Kapenguria","Kitui","Mwingi","Matuu","Sagana","Karatina","Nanyuki","Nyeri","Othaya","Mwea","Kerugoya","Embu","Runyenjes","Chuka","Meru","Maua","Chogoria","Mikindani","Mariakani","Kilifi","Malindi","Watamu","Lamu","Witu","Hola","Bura","Garissa","Dadaab","Wajir","Mandera","El Wak","Rhamu","Moyale","Marsabit","Isiolo","Archers Post","Samburu","Maralal","Nyahururu","Nakuru","Naivasha","Gilgil","Molo","Njoro","Eldoret","Kitale","Webuye","Bungoma","Kimilili","Kakamega","Mumias","Busia","Bondo","Siaya","Kisumu","Ahero","Kisii","Kericho","Homa Bay","Migori","Rongo","Bomet","Narok","Suswa","Nairobi"];

// combine the city arrays into a single array
const cities = [
    ...south_africa, 
    // ...kenya, 
    // ...botswana, 
    // ...namibia, 
    // ...zimbabwe
];

const keywords = shuffleArray(cities)
    .slice(0, LIMIT)
    .map(city => ({ keyword: `${city} cars for sale contact email @gmail.com` }));

module.exports = { keywords };