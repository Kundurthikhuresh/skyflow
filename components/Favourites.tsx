import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Trash2, Globe, Search, Plus, Star, ChevronRight, ChevronDown } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';

interface FavouritesProps {
  onSelectCity: (city: string) => void;
  isDark: boolean;
}

// Indian States with cities, mandals, and towns
const INDIAN_STATES: Record<string, { city: string; district?: string }[]> = {
  "Andhra Pradesh": [
    // Major Cities
    { city: "Visakhapatnam" }, { city: "Vijayawada" }, { city: "Guntur" },
    { city: "Nellore" }, { city: "Kurnool" }, { city: "Rajahmundry" },
    { city: "Tirupati" }, { city: "Kakinada" }, { city: "Kadapa" },
    { city: "Anantapur" }, { city: "Eluru" }, { city: "Ongole" },
    { city: "Vizianagaram" }, { city: "Machilipatnam" }, { city: "Tenali" },
    { city: "Proddatur" }, { city: "Chittoor" }, { city: "Hindupur" },
    { city: "Bhimavaram" }, { city: "Madanapalle" }, { city: "Guntakal" },
    { city: "Srikakulam" }, { city: "Dharmavaram" }, { city: "Gudivada" },
    { city: "Narasaraopet" }, { city: "Tadipatri" }, { city: "Amaravati" },
    // Guntur District - Mandals & Towns
    { city: "Mangalagiri" }, { city: "Tadepalli" }, { city: "Thullur" },
    { city: "Sattenapalli" }, { city: "Chilakaluripet" }, { city: "Ponnur" },
    { city: "Bapatla" }, { city: "Repalle" }, { city: "Macherla" },
    { city: "Vinukonda" }, { city: "Piduguralla" }, { city: "Dachepalli" },
    { city: "Gurazala" }, { city: "Karempudi" }, { city: "Veldurthi" },
    { city: "Phirangipuram" }, { city: "Medikonduru" }, { city: "Prattipadu" },
    { city: "Chebrolu" }, { city: "Duggirala" }, { city: "Kakumanu" },
    { city: "Pedakurapadu" }, { city: "Tadikonda" }, { city: "Kollipara" },
    { city: "Tsunduru" }, { city: "Pedanandipadu" }, { city: "Vatticherukuru" },
    // Prakasam District - Mandals & Towns
    { city: "Singaraikonda" }, { city: "Kandukur" }, { city: "Chirala" },
    { city: "Markapur" }, { city: "Addanki" }, { city: "Darsi" },
    { city: "Giddalur" }, { city: "Podili" }, { city: "Kanigiri" },
    { city: "Cumbum" }, { city: "Yerragondapalem" }, { city: "Santhanuthalapadu" },
    { city: "Maddipadu" }, { city: "Tangutur" }, { city: "Pamur" },
    { city: "Konakanamitla" }, { city: "Bestavaripeta" }, { city: "Donakonda" },
    { city: "Chimakurthy" }, { city: "Parchur" }, { city: "Vetapalem" },
    { city: "Inkollu" }, { city: "Korisapadu" }, { city: "Pedacherlopalle" },
    { city: "Mundlamuru" }, { city: "Tripuranthakam" }, { city: "Ardhaveedu" },
    { city: "Kurichedu" }, { city: "Pullalacheruvu" }, { city: "Racherla" },
    { city: "Dornala" }, { city: "Lingasamudram" }, { city: "Ulavapadu" },
    { city: "Veligandla" }, { city: "Marripudi" }, { city: "Naguluppala" },
    // Krishna District - Mandals & Towns
    { city: "Jaggayyapeta" }, { city: "Nandigama" }, { city: "Tiruvuru" },
    { city: "Nuzvid" }, { city: "Mylavaram" }, { city: "Gannavaram" },
    { city: "Vuyyuru" }, { city: "Pamarru" }, { city: "Pedana" },
    { city: "Avanigadda" }, { city: "Movva" }, { city: "Kaikalur" },
    { city: "Bantumilli" }, { city: "Challapalli" }, { city: "Ghantasala" },
    { city: "Guduru" }, { city: "Gudlavalleru" }, { city: "Unguturu" },
    { city: "Vissannapet" }, { city: "Ibrahimpatnam" }, { city: "Kankipadu" },
    // Nellore District - Mandals & Towns
    { city: "Kavali" }, { city: "Gudur" }, { city: "Atmakur" },
    { city: "Sullurpeta" }, { city: "Venkatagiri" }, { city: "Kovur" },
    { city: "Kodavalur" }, { city: "Allur" }, { city: "Ananthasagaram" },
    { city: "Bogole" }, { city: "Buchireddypalem" }, { city: "Chejerla" },
    { city: "Dagadarthi" }, { city: "Duttalur" }, { city: "Indukurpeta" },
    { city: "Jaladanki" }, { city: "Kaluvoya" }, { city: "Kondapuram" },
    { city: "Manubolu" }, { city: "Marripadu" }, { city: "Muthukur" },
    { city: "Naidupeta" }, { city: "Ozili" }, { city: "Pellakur" },
    { city: "Podalakur" }, { city: "Rapur" }, { city: "Sangam" },
    { city: "Seetharamapuram" }, { city: "Sydapuram" }, { city: "Tada" },
    { city: "Udayagiri" }, { city: "Varikuntapadu" }, { city: "Vidavalur" },
    { city: "Vinjamur" }, { city: "Kondapuram" },
    // East Godavari - Mandals & Towns
    { city: "Amalapuram" }, { city: "Mandapeta" }, { city: "Peddapuram" },
    { city: "Samalkot" }, { city: "Tuni" }, { city: "Pithapuram" },
    { city: "Ramachandrapuram" }, { city: "Mummidivaram" }, { city: "Kothapeta" },
    { city: "Gollaprolu" }, { city: "Prathipadu" }, { city: "Karapa" },
    { city: "Rajanagaram" }, { city: "Korukonda" }, { city: "Kadiam" },
    { city: "Rangampeta" }, { city: "Jaggampeta" }, { city: "Gandepalli" },
    { city: "Kajuluru" }, { city: "Kotananduru" }, { city: "Sankhavaram" },
    { city: "Thondangi" }, { city: "Rowthulapudi" }, { city: "Yeleswaram" },
    // West Godavari - Mandals & Towns
    { city: "Tadepalligudem" }, { city: "Tanuku" }, { city: "Narsapur" },
    { city: "Palacole" }, { city: "Narasapuram" }, { city: "Kovvur" },
    { city: "Gopalapuram" }, { city: "Nidadavolu" }, { city: "Jangareddygudem" },
    { city: "Chintalapudi" }, { city: "Buttaigudem" }, { city: "Polavaram" },
    { city: "Devarapalli" }, { city: "T. Narasapuram" }, { city: "Akividu" },
    { city: "Undi" }, { city: "Kalla" }, { city: "Pentapadu" },
    { city: "Peravali" }, { city: "Poduru" }, { city: "Penumantra" },
    // Visakhapatnam District - Mandals & Towns
    { city: "Anakapalli" }, { city: "Narsipatnam" }, { city: "Yelamanchili" },
    { city: "Chodavaram" }, { city: "Payakaraopeta" }, { city: "Nakkapalli" },
    { city: "S.Rayavaram" }, { city: "K.Kotapadu" }, { city: "Kasimkota" },
    { city: "Rambilli" }, { city: "Munagapaka" }, { city: "Anandapuram" },
    { city: "Padmanabham" }, { city: "Pendurthi" }, { city: "Gajuwaka" },
    { city: "Bheemunipatnam" }, { city: "Visakhapatnam Rural" },
    // Chittoor District - Mandals & Towns
    { city: "Srikalahasti" }, { city: "Puttur" }, { city: "Palamaner" },
    { city: "Nagari" }, { city: "Punganur" }, { city: "Kuppam" },
    { city: "Piler" }, { city: "Vayalpad" }, { city: "Chandragiri" },
    { city: "Pakala" }, { city: "Renigunta" }, { city: "Yerpedu" },
    { city: "Bangarupalyam" }, { city: "Chittoor Rural" }, { city: "Gangadhara Nellore" },
    { city: "Gudipala" }, { city: "Irala" }, { city: "Kalikiri" },
    { city: "Karvetinagaram" }, { city: "Kurabalakota" }, { city: "Penumur" },
    { city: "Puthalapattu" }, { city: "Ramakuppam" }, { city: "Santhipuram" },
    { city: "Somala" }, { city: "Thavanampalle" }, { city: "Vadamalapet" },
    { city: "Vedurukuppam" }, { city: "Vijayapuram" }, { city: "Yadamarri" },
    // Anantapur District - Mandals & Towns
    { city: "Gooty" }, { city: "Pamidi" }, { city: "Rayadurg" },
    { city: "Kalyandurg" }, { city: "Penukonda" }, { city: "Kadiri" },
    { city: "Madakasira" }, { city: "Puttaparthi" }, { city: "Bukkapatnam" },
    { city: "Kanekal" }, { city: "Uravakonda" }, { city: "Atmakur" },
    // Kurnool District - Mandals & Towns
    { city: "Adoni" }, { city: "Yemmiganur" }, { city: "Nandyal" },
    { city: "Dhone" }, { city: "Nandikotkur" }, { city: "Atmakur" },
    { city: "Allagadda" }, { city: "Koilkuntla" }, { city: "Banaganapalle" },
    { city: "Pattikonda" }, { city: "Bethamcherla" }, { city: "Gudur" },
  ],
  "Telangana": [
    // Major Cities
    { city: "Hyderabad" }, { city: "Secunderabad" }, { city: "Warangal" },
    { city: "Nizamabad" }, { city: "Khammam" }, { city: "Karimnagar" },
    { city: "Ramagundam" }, { city: "Mahbubnagar" }, { city: "Nalgonda" },
    { city: "Adilabad" }, { city: "Suryapet" }, { city: "Miryalaguda" },
    { city: "Jagtial" }, { city: "Mancherial" }, { city: "Nirmal" },
    { city: "Kamareddy" }, { city: "Kothagudem" }, { city: "Bodhan" },
    { city: "Sangareddy" }, { city: "Siddipet" }, { city: "Wanaparthy" },
    { city: "Medak" }, { city: "Vikarabad" }, { city: "Zaheerabad" },
    // Hyderabad Districts - Areas & Mandals
    { city: "Kukatpally" }, { city: "Gachibowli" }, { city: "Madhapur" },
    { city: "HITEC City" }, { city: "Kondapur" }, { city: "Miyapur" },
    { city: "Chandanagar" }, { city: "Lingampally" }, { city: "Patancheru" },
    { city: "Serilingampally" }, { city: "Malkajgiri" }, { city: "Uppal" },
    { city: "LB Nagar" }, { city: "Dilsukhnagar" }, { city: "Nagole" },
    { city: "Hayathnagar" }, { city: "Vanasthalipuram" }, { city: "Meerpet" },
    { city: "Shamshabad" }, { city: "Rajendranagar" }, { city: "Attapur" },
    { city: "Banjara Hills" }, { city: "Jubilee Hills" }, { city: "Somajiguda" },
    { city: "Ameerpet" }, { city: "Punjagutta" }, { city: "Begumpet" },
    { city: "Trimulgherry" }, { city: "Alwal" }, { city: "Bowenpally" },
    { city: "Kompally" }, { city: "Medchal" }, { city: "Shamirpet" },
    { city: "Keesara" }, { city: "Ghatkesar" }, { city: "Pocharam" },
    // Rangareddy District - Mandals
    { city: "Ibrahimpatnam" }, { city: "Maheshwaram" }, { city: "Kandukur" },
    { city: "Yacharam" }, { city: "Manchal" }, { city: "Amangal" },
    { city: "Pudur" }, { city: "Chevella" }, { city: "Moinabad" },
    { city: "Shankarpally" }, { city: "Mokila" }, { city: "Shadnagar" },
    { city: "Kothur" }, { city: "Farooqnagar" }, { city: "Nandigama" },
    // Medchal-Malkajgiri - Mandals
    { city: "Qutbullapur" }, { city: "Dundigal" }, { city: "Balanagar" },
    // Sangareddy District - Mandals
    { city: "Sadashivpet" }, { city: "Narayankhed" }, { city: "Andole" },
    { city: "Jharasangam" }, { city: "Kondapur" }, { city: "Ameenpur" },
    { city: "Sadasivpet" }, { city: "Patancheru" }, { city: "Ramachandrapuram" },
    // Nalgonda District - Mandals
    { city: "Bhongir" }, { city: "Yadagirigutta" }, { city: "Choutuppal" },
    { city: "Nakrekal" }, { city: "Chityal" }, { city: "Devarakonda" },
    { city: "Halia" }, { city: "Chandur" }, { city: "Kodad" },
    { city: "Mothkur" }, { city: "Thipparthi" }, { city: "Neredcherla" },
    // Warangal Districts - Mandals
    { city: "Hanamkonda" }, { city: "Kazipet" }, { city: "Hasanparthy" },
    { city: "Elkathurthy" }, { city: "Jangaon" }, { city: "Ghanpur" },
    { city: "Palakurthy" }, { city: "Mahabubabad" }, { city: "Thorrur" },
    { city: "Narsampet" }, { city: "Parkal" }, { city: "Chennaraopet" },
    { city: "Atmakur" }, { city: "Sangem" }, { city: "Wardhanapet" },
    { city: "Duggondi" }, { city: "Nekkonda" }, { city: "Nallabelly" },
    // Karimnagar District - Mandals
    { city: "Jammikunta" }, { city: "Huzurabad" }, { city: "Peddapalli" },
    { city: "Godavarikhani" }, { city: "Manthani" }, { city: "Sircilla" },
    { city: "Vemulawada" }, { city: "Choppadandi" }, { city: "Manakondur" },
    { city: "Gambhiraopet" }, { city: "Sulthanabad" }, { city: "Thimmapur" },
    { city: "Kohir" }, { city: "Chigurumamidi" }, { city: "Ellanthakunta" },
    // Nizamabad District - Mandals
    { city: "Armoor" }, { city: "Banswada" }, { city: "Yellareddy" },
    { city: "Balkonda" }, { city: "Bheemgal" }, { city: "Dharpally" },
    { city: "Dichpally" }, { city: "Jakranpally" }, { city: "Kotagiri" },
    { city: "Machareddy" }, { city: "Makloor" }, { city: "Mortad" },
    { city: "Nandipet" }, { city: "Navipet" }, { city: "Renjal" },
    { city: "Sirikonda" }, { city: "Tadwai" }, { city: "Velpur" },
    // Khammam District - Mandals
    { city: "Madhira" }, { city: "Wyra" }, { city: "Sattupalli" },
    { city: "Yellandu" }, { city: "Bhadrachalam" }, { city: "Burgampahad" },
    { city: "Kallur" }, { city: "Nelakondapally" }, { city: "Singareni" },
    { city: "Palwancha" }, { city: "Manuguru" }, { city: "Mulakalapally" },
    { city: "Vemsoor" }, { city: "Penuballi" }, { city: "Raghunadhapalem" },
    { city: "Tirumalayapalem" }, { city: "Kusumanchi" }, { city: "Chintakani" },
  ],
  "Tamil Nadu": [
    { city: "Chennai" }, { city: "Coimbatore" }, { city: "Madurai" },
    { city: "Tiruchirappalli" }, { city: "Salem" }, { city: "Tirunelveli" },
    { city: "Tiruppur" }, { city: "Vellore" }, { city: "Erode" },
    { city: "Thoothukkudi" }, { city: "Dindigul" }, { city: "Thanjavur" },
    { city: "Ranipet" }, { city: "Sivakasi" }, { city: "Karur" },
    { city: "Udhagamandalam" }, { city: "Hosur" }, { city: "Nagercoil" },
    { city: "Kanchipuram" }, { city: "Kumarapalayam" }, { city: "Karaikkudi" },
    { city: "Neyveli" }, { city: "Cuddalore" }, { city: "Kumbakonam" },
    { city: "Tiruvannamalai" }, { city: "Pollachi" }, { city: "Rajapalayam" },
    { city: "Pudukkottai" }, { city: "Vaniyambadi" }, { city: "Ambur" },
  ],
  "Karnataka": [
    { city: "Bengaluru" }, { city: "Mysuru" }, { city: "Mangaluru" },
    { city: "Hubballi-Dharwad" }, { city: "Belagavi" }, { city: "Kalaburagi" },
    { city: "Ballari" }, { city: "Vijayapura" }, { city: "Shivamogga" },
    { city: "Tumakuru" }, { city: "Davanagere" }, { city: "Raichur" },
    { city: "Hassan" }, { city: "Robertson Pet" }, { city: "Bidar" },
    { city: "Hospet" }, { city: "Gadag-Betageri" }, { city: "Udupi" },
    { city: "Chitradurga" }, { city: "Chikkamagaluru" }, { city: "Mandya" },
    { city: "Kolar" }, { city: "Bagalkot" }, { city: "Ranebennur" },
  ],
  "Kerala": [
    { city: "Thiruvananthapuram" }, { city: "Kochi" }, { city: "Kozhikode" },
    { city: "Thrissur" }, { city: "Kollam" }, { city: "Palakkad" },
    { city: "Alappuzha" }, { city: "Kannur" }, { city: "Kottayam" },
    { city: "Kasaragod" }, { city: "Malappuram" }, { city: "Pathanamthitta" },
    { city: "Idukki" }, { city: "Wayanad" }, { city: "Ernakulam" },
    { city: "Munnar" }, { city: "Thekkady" }, { city: "Varkala" },
  ],
  "Maharashtra": [
    { city: "Mumbai" }, { city: "Pune" }, { city: "Nagpur" },
    { city: "Thane" }, { city: "Nashik" }, { city: "Aurangabad" },
    { city: "Solapur" }, { city: "Kolhapur" }, { city: "Amravati" },
    { city: "Navi Mumbai" }, { city: "Sangli" }, { city: "Jalgaon" },
    { city: "Akola" }, { city: "Latur" }, { city: "Dhule" },
    { city: "Ahmednagar" }, { city: "Chandrapur" }, { city: "Parbhani" },
    { city: "Ichalkaranji" }, { city: "Jalna" }, { city: "Ambernath" },
    { city: "Bhiwandi" }, { city: "Panvel" }, { city: "Badlapur" },
    { city: "Beed" }, { city: "Gondia" }, { city: "Satara" },
    { city: "Barshi" }, { city: "Yavatmal" }, { city: "Achalpur" },
  ],
  "Gujarat": [
    { city: "Ahmedabad" }, { city: "Surat" }, { city: "Vadodara" },
    { city: "Rajkot" }, { city: "Bhavnagar" }, { city: "Jamnagar" },
    { city: "Junagadh" }, { city: "Gandhinagar" }, { city: "Anand" },
    { city: "Nadiad" }, { city: "Morbi" }, { city: "Mehsana" },
    { city: "Bharuch" }, { city: "Porbandar" }, { city: "Godhra" },
    { city: "Navsari" }, { city: "Valsad" }, { city: "Palanpur" },
    { city: "Vapi" }, { city: "Gondal" }, { city: "Veraval" },
    { city: "Gandhidham" }, { city: "Dahod" }, { city: "Botad" },
  ],
  "Rajasthan": [
    { city: "Jaipur" }, { city: "Jodhpur" }, { city: "Kota" },
    { city: "Bikaner" }, { city: "Ajmer" }, { city: "Udaipur" },
    { city: "Bhilwara" }, { city: "Alwar" }, { city: "Bharatpur" },
    { city: "Sikar" }, { city: "Pali" }, { city: "Sri Ganganagar" },
    { city: "Jhunjhunu" }, { city: "Churu" }, { city: "Chittorgarh" },
    { city: "Nagaur" }, { city: "Jaisalmer" }, { city: "Pushkar" },
    { city: "Mount Abu" }, { city: "Tonk" }, { city: "Kishangarh" },
    { city: "Beawar" }, { city: "Hanumangarh" }, { city: "Dhaulpur" },
  ],
  "Uttar Pradesh": [
    { city: "Lucknow" }, { city: "Kanpur" }, { city: "Ghaziabad" },
    { city: "Agra" }, { city: "Varanasi" }, { city: "Meerut" },
    { city: "Prayagraj" }, { city: "Bareilly" }, { city: "Aligarh" },
    { city: "Moradabad" }, { city: "Saharanpur" }, { city: "Gorakhpur" },
    { city: "Noida" }, { city: "Firozabad" }, { city: "Jhansi" },
    { city: "Muzaffarnagar" }, { city: "Mathura" }, { city: "Rampur" },
    { city: "Shahjahanpur" }, { city: "Farrukhabad" }, { city: "Mau" },
    { city: "Hapur" }, { city: "Etawah" }, { city: "Mirzapur" },
    { city: "Bulandshahr" }, { city: "Sambhal" }, { city: "Amroha" },
    { city: "Hardoi" }, { city: "Fatehpur" }, { city: "Raebareli" },
    { city: "Ayodhya" }, { city: "Unnao" }, { city: "Jaunpur" },
    { city: "Lakhimpur" }, { city: "Hathras" }, { city: "Banda" },
  ],
  "Madhya Pradesh": [
    { city: "Indore" }, { city: "Bhopal" }, { city: "Jabalpur" },
    { city: "Gwalior" }, { city: "Ujjain" }, { city: "Sagar" },
    { city: "Dewas" }, { city: "Satna" }, { city: "Ratlam" },
    { city: "Rewa" }, { city: "Murwara" }, { city: "Singrauli" },
    { city: "Burhanpur" }, { city: "Khandwa" }, { city: "Bhind" },
    { city: "Chhindwara" }, { city: "Guna" }, { city: "Shivpuri" },
    { city: "Vidisha" }, { city: "Chhatarpur" }, { city: "Damoh" },
    { city: "Mandsaur" }, { city: "Khargone" }, { city: "Neemuch" },
  ],
  "West Bengal": [
    { city: "Kolkata" }, { city: "Howrah" }, { city: "Durgapur" },
    { city: "Asansol" }, { city: "Siliguri" }, { city: "Bardhaman" },
    { city: "Malda" }, { city: "Baharampur" }, { city: "Habra" },
    { city: "Kharagpur" }, { city: "Shantipur" }, { city: "Dankuni" },
    { city: "Dhulian" }, { city: "Ranaghat" }, { city: "Haldia" },
    { city: "Raiganj" }, { city: "Krishnanagar" }, { city: "Nabadwip" },
    { city: "Medinipur" }, { city: "Jalpaiguri" }, { city: "Balurghat" },
    { city: "Basirhat" }, { city: "Bankura" }, { city: "Darjeeling" },
  ],
  "Bihar": [
    { city: "Patna" }, { city: "Gaya" }, { city: "Bhagalpur" },
    { city: "Muzaffarpur" }, { city: "Purnia" }, { city: "Darbhanga" },
    { city: "Bihar Sharif" }, { city: "Arrah" }, { city: "Begusarai" },
    { city: "Katihar" }, { city: "Munger" }, { city: "Chhapra" },
    { city: "Danapur" }, { city: "Saharsa" }, { city: "Sasaram" },
    { city: "Hajipur" }, { city: "Dehri" }, { city: "Siwan" },
    { city: "Motihari" }, { city: "Nawada" }, { city: "Bagaha" },
    { city: "Buxar" }, { city: "Kishanganj" }, { city: "Sitamarhi" },
  ],
  "Odisha": [
    { city: "Bhubaneswar" }, { city: "Cuttack" }, { city: "Rourkela" },
    { city: "Brahmapur" }, { city: "Sambalpur" }, { city: "Puri" },
    { city: "Balasore" }, { city: "Bhadrak" }, { city: "Baripada" },
    { city: "Jharsuguda" }, { city: "Jeypore" }, { city: "Bargarh" },
    { city: "Paradip" }, { city: "Bhawanipatna" }, { city: "Dhenkanal" },
    { city: "Barbil" }, { city: "Kendrapara" }, { city: "Sunabeda" },
    { city: "Konark" }, { city: "Angul" }, { city: "Rayagada" },
  ],
  "Punjab": [
    { city: "Ludhiana" }, { city: "Amritsar" }, { city: "Jalandhar" },
    { city: "Patiala" }, { city: "Bathinda" }, { city: "Mohali" },
    { city: "Pathankot" }, { city: "Hoshiarpur" }, { city: "Batala" },
    { city: "Moga" }, { city: "Malerkotla" }, { city: "Khanna" },
    { city: "Phagwara" }, { city: "Muktsar" }, { city: "Barnala" },
    { city: "Rajpura" }, { city: "Firozpur" }, { city: "Kapurthala" },
  ],
  "Haryana": [
    { city: "Faridabad" }, { city: "Gurgaon" }, { city: "Panipat" },
    { city: "Ambala" }, { city: "Yamunanagar" }, { city: "Rohtak" },
    { city: "Hisar" }, { city: "Karnal" }, { city: "Sonipat" },
    { city: "Panchkula" }, { city: "Bhiwani" }, { city: "Sirsa" },
    { city: "Bahadurgarh" }, { city: "Jind" }, { city: "Thanesar" },
    { city: "Kaithal" }, { city: "Rewari" }, { city: "Palwal" },
  ],
  "Jharkhand": [
    { city: "Ranchi" }, { city: "Jamshedpur" }, { city: "Dhanbad" },
    { city: "Bokaro" }, { city: "Hazaribagh" }, { city: "Deoghar" },
    { city: "Giridih" }, { city: "Ramgarh" }, { city: "Medininagar" },
    { city: "Chirkunda" }, { city: "Phusro" }, { city: "Adityapur" },
  ],
  "Chhattisgarh": [
    { city: "Raipur" }, { city: "Bhilai" }, { city: "Bilaspur" },
    { city: "Korba" }, { city: "Durg" }, { city: "Rajnandgaon" },
    { city: "Jagdalpur" }, { city: "Raigarh" }, { city: "Ambikapur" },
    { city: "Chirmiri" }, { city: "Dhamtari" }, { city: "Mahasamund" },
  ],
  "Assam": [
    { city: "Guwahati" }, { city: "Silchar" }, { city: "Dibrugarh" },
    { city: "Jorhat" }, { city: "Nagaon" }, { city: "Tinsukia" },
    { city: "Tezpur" }, { city: "Bongaigaon" }, { city: "Diphu" },
    { city: "North Lakhimpur" }, { city: "Dhubri" }, { city: "Karimganj" },
  ],
  "Uttarakhand": [
    { city: "Dehradun" }, { city: "Haridwar" }, { city: "Roorkee" },
    { city: "Haldwani" }, { city: "Rudrapur" }, { city: "Kashipur" },
    { city: "Rishikesh" }, { city: "Pithoragarh" }, { city: "Ramnagar" },
    { city: "Mussoorie" }, { city: "Nainital" }, { city: "Almora" },
  ],
  "Himachal Pradesh": [
    { city: "Shimla" }, { city: "Mandi" }, { city: "Solan" },
    { city: "Dharamshala" }, { city: "Baddi" }, { city: "Nahan" },
    { city: "Palampur" }, { city: "Sundernagar" }, { city: "Kullu" },
    { city: "Manali" }, { city: "Chamba" }, { city: "Una" },
  ],
  "Jammu & Kashmir": [
    { city: "Srinagar" }, { city: "Jammu" }, { city: "Anantnag" },
    { city: "Baramulla" }, { city: "Sopore" }, { city: "Kathua" },
    { city: "Udhampur" }, { city: "Leh" }, { city: "Kargil" },
    { city: "Gulmarg" }, { city: "Pahalgam" }, { city: "Poonch" },
  ],
  "Goa": [
    { city: "Panaji" }, { city: "Margao" }, { city: "Vasco da Gama" },
    { city: "Mapusa" }, { city: "Ponda" }, { city: "Bicholim" },
    { city: "Calangute" }, { city: "Candolim" }, { city: "Anjuna" },
  ],
  "Delhi": [
    { city: "New Delhi" }, { city: "Delhi" }, { city: "Dwarka" },
    { city: "Rohini" }, { city: "Pitampura" }, { city: "Janakpuri" },
    { city: "Lajpat Nagar" }, { city: "Saket" }, { city: "Karol Bagh" },
    { city: "Connaught Place" }, { city: "Chandni Chowk" }, { city: "Nehru Place" },
  ],
};

// International cities by country
const WORLD_COUNTRIES: Record<string, { city: string; flag: string }[]> = {
  "United States 🇺🇸": [
    { city: "New York", flag: "🇺🇸" }, { city: "Los Angeles", flag: "🇺🇸" },
    { city: "Chicago", flag: "🇺🇸" }, { city: "Houston", flag: "🇺🇸" },
    { city: "Phoenix", flag: "🇺🇸" }, { city: "Philadelphia", flag: "🇺🇸" },
    { city: "San Antonio", flag: "🇺🇸" }, { city: "San Diego", flag: "🇺🇸" },
    { city: "Dallas", flag: "🇺🇸" }, { city: "San Jose", flag: "🇺🇸" },
    { city: "Austin", flag: "🇺🇸" }, { city: "Jacksonville", flag: "🇺🇸" },
    { city: "San Francisco", flag: "🇺🇸" }, { city: "Seattle", flag: "🇺🇸" },
    { city: "Denver", flag: "🇺🇸" }, { city: "Boston", flag: "🇺🇸" },
    { city: "Miami", flag: "🇺🇸" }, { city: "Atlanta", flag: "🇺🇸" },
    { city: "Las Vegas", flag: "🇺🇸" }, { city: "Washington D.C.", flag: "🇺🇸" },
  ],
  "United Kingdom 🇬🇧": [
    { city: "London", flag: "🇬🇧" }, { city: "Birmingham", flag: "🇬🇧" },
    { city: "Manchester", flag: "🇬🇧" }, { city: "Glasgow", flag: "🇬🇧" },
    { city: "Liverpool", flag: "🇬🇧" }, { city: "Bristol", flag: "🇬🇧" },
    { city: "Edinburgh", flag: "🇬🇧" }, { city: "Leeds", flag: "🇬🇧" },
    { city: "Sheffield", flag: "🇬🇧" }, { city: "Newcastle", flag: "🇬🇧" },
    { city: "Cardiff", flag: "🇬🇧" }, { city: "Belfast", flag: "🇬🇧" },
  ],
  "Canada 🇨🇦": [
    { city: "Toronto", flag: "🇨🇦" }, { city: "Montreal", flag: "🇨🇦" },
    { city: "Vancouver", flag: "🇨🇦" }, { city: "Calgary", flag: "🇨🇦" },
    { city: "Edmonton", flag: "🇨🇦" }, { city: "Ottawa", flag: "🇨🇦" },
    { city: "Winnipeg", flag: "🇨🇦" }, { city: "Quebec City", flag: "🇨🇦" },
    { city: "Hamilton", flag: "🇨🇦" }, { city: "Halifax", flag: "🇨🇦" },
  ],
  "Australia 🇦🇺": [
    { city: "Sydney", flag: "🇦🇺" }, { city: "Melbourne", flag: "🇦🇺" },
    { city: "Brisbane", flag: "🇦🇺" }, { city: "Perth", flag: "🇦🇺" },
    { city: "Adelaide", flag: "🇦🇺" }, { city: "Gold Coast", flag: "🇦🇺" },
    { city: "Canberra", flag: "🇦🇺" }, { city: "Newcastle", flag: "🇦🇺" },
    { city: "Hobart", flag: "🇦🇺" }, { city: "Darwin", flag: "🇦🇺" },
  ],
  "Germany 🇩🇪": [
    { city: "Berlin", flag: "🇩🇪" }, { city: "Hamburg", flag: "🇩🇪" },
    { city: "Munich", flag: "🇩🇪" }, { city: "Cologne", flag: "🇩🇪" },
    { city: "Frankfurt", flag: "🇩🇪" }, { city: "Stuttgart", flag: "🇩🇪" },
    { city: "Dusseldorf", flag: "🇩🇪" }, { city: "Leipzig", flag: "🇩🇪" },
    { city: "Dortmund", flag: "🇩🇪" }, { city: "Essen", flag: "🇩🇪" },
  ],
  "France 🇫🇷": [
    { city: "Paris", flag: "🇫🇷" }, { city: "Marseille", flag: "🇫🇷" },
    { city: "Lyon", flag: "🇫🇷" }, { city: "Toulouse", flag: "🇫🇷" },
    { city: "Nice", flag: "🇫🇷" }, { city: "Nantes", flag: "🇫🇷" },
    { city: "Strasbourg", flag: "🇫🇷" }, { city: "Montpellier", flag: "🇫🇷" },
    { city: "Bordeaux", flag: "🇫🇷" }, { city: "Lille", flag: "🇫🇷" },
  ],
  "Japan 🇯🇵": [
    { city: "Tokyo", flag: "🇯🇵" }, { city: "Osaka", flag: "🇯🇵" },
    { city: "Yokohama", flag: "🇯🇵" }, { city: "Nagoya", flag: "🇯🇵" },
    { city: "Sapporo", flag: "🇯🇵" }, { city: "Kobe", flag: "🇯🇵" },
    { city: "Kyoto", flag: "🇯🇵" }, { city: "Fukuoka", flag: "🇯🇵" },
    { city: "Kawasaki", flag: "🇯🇵" }, { city: "Hiroshima", flag: "🇯🇵" },
  ],
  "China 🇨🇳": [
    { city: "Shanghai", flag: "🇨🇳" }, { city: "Beijing", flag: "🇨🇳" },
    { city: "Guangzhou", flag: "🇨🇳" }, { city: "Shenzhen", flag: "🇨🇳" },
    { city: "Chengdu", flag: "🇨🇳" }, { city: "Hangzhou", flag: "🇨🇳" },
    { city: "Wuhan", flag: "🇨🇳" }, { city: "Xi'an", flag: "🇨🇳" },
    { city: "Nanjing", flag: "🇨🇳" }, { city: "Hong Kong", flag: "🇭🇰" },
  ],
  "UAE 🇦🇪": [
    { city: "Dubai", flag: "🇦🇪" }, { city: "Abu Dhabi", flag: "🇦🇪" },
    { city: "Sharjah", flag: "🇦🇪" }, { city: "Ajman", flag: "🇦🇪" },
    { city: "Ras Al Khaimah", flag: "🇦🇪" }, { city: "Fujairah", flag: "🇦🇪" },
  ],
  "Singapore 🇸🇬": [
    { city: "Singapore", flag: "🇸🇬" },
  ],
  "South Korea 🇰🇷": [
    { city: "Seoul", flag: "🇰🇷" }, { city: "Busan", flag: "🇰🇷" },
    { city: "Incheon", flag: "🇰🇷" }, { city: "Daegu", flag: "🇰🇷" },
    { city: "Daejeon", flag: "🇰🇷" }, { city: "Gwangju", flag: "🇰🇷" },
  ],
  "Brazil 🇧🇷": [
    { city: "São Paulo", flag: "🇧🇷" }, { city: "Rio de Janeiro", flag: "🇧🇷" },
    { city: "Brasília", flag: "🇧🇷" }, { city: "Salvador", flag: "🇧🇷" },
    { city: "Fortaleza", flag: "🇧🇷" }, { city: "Belo Horizonte", flag: "🇧🇷" },
    { city: "Manaus", flag: "🇧🇷" }, { city: "Curitiba", flag: "🇧🇷" },
  ],
  "Russia 🇷🇺": [
    { city: "Moscow", flag: "🇷🇺" }, { city: "Saint Petersburg", flag: "🇷🇺" },
    { city: "Novosibirsk", flag: "🇷🇺" }, { city: "Yekaterinburg", flag: "🇷🇺" },
    { city: "Kazan", flag: "🇷🇺" }, { city: "Nizhny Novgorod", flag: "🇷🇺" },
  ],
  "Italy 🇮🇹": [
    { city: "Rome", flag: "🇮🇹" }, { city: "Milan", flag: "🇮🇹" },
    { city: "Naples", flag: "🇮🇹" }, { city: "Turin", flag: "🇮🇹" },
    { city: "Florence", flag: "🇮🇹" }, { city: "Venice", flag: "🇮🇹" },
    { city: "Bologna", flag: "🇮🇹" }, { city: "Genoa", flag: "🇮🇹" },
  ],
  "Spain 🇪🇸": [
    { city: "Madrid", flag: "🇪🇸" }, { city: "Barcelona", flag: "🇪🇸" },
    { city: "Valencia", flag: "🇪🇸" }, { city: "Seville", flag: "🇪🇸" },
    { city: "Zaragoza", flag: "🇪🇸" }, { city: "Malaga", flag: "🇪🇸" },
    { city: "Bilbao", flag: "🇪🇸" }, { city: "Alicante", flag: "🇪🇸" },
  ],
  "Mexico 🇲🇽": [
    { city: "Mexico City", flag: "🇲🇽" }, { city: "Guadalajara", flag: "🇲🇽" },
    { city: "Monterrey", flag: "🇲🇽" }, { city: "Puebla", flag: "🇲🇽" },
    { city: "Tijuana", flag: "🇲🇽" }, { city: "Cancún", flag: "🇲🇽" },
  ],
  "South Africa 🇿🇦": [
    { city: "Johannesburg", flag: "🇿🇦" }, { city: "Cape Town", flag: "🇿🇦" },
    { city: "Durban", flag: "🇿🇦" }, { city: "Pretoria", flag: "🇿🇦" },
    { city: "Port Elizabeth", flag: "🇿🇦" }, { city: "Bloemfontein", flag: "🇿🇦" },
  ],
  "Thailand 🇹🇭": [
    { city: "Bangkok", flag: "🇹🇭" }, { city: "Chiang Mai", flag: "🇹🇭" },
    { city: "Pattaya", flag: "🇹🇭" }, { city: "Phuket", flag: "🇹🇭" },
    { city: "Nonthaburi", flag: "🇹🇭" }, { city: "Khon Kaen", flag: "🇹🇭" },
  ],
  "Indonesia 🇮🇩": [
    { city: "Jakarta", flag: "🇮🇩" }, { city: "Surabaya", flag: "🇮🇩" },
    { city: "Bandung", flag: "🇮🇩" }, { city: "Medan", flag: "🇮🇩" },
    { city: "Bali", flag: "🇮🇩" }, { city: "Semarang", flag: "🇮🇩" },
  ],
  "Malaysia 🇲🇾": [
    { city: "Kuala Lumpur", flag: "🇲🇾" }, { city: "George Town", flag: "🇲🇾" },
    { city: "Johor Bahru", flag: "🇲🇾" }, { city: "Ipoh", flag: "🇲🇾" },
    { city: "Malacca City", flag: "🇲🇾" }, { city: "Kota Kinabalu", flag: "🇲🇾" },
  ],
  "Egypt 🇪🇬": [
    { city: "Cairo", flag: "🇪🇬" }, { city: "Alexandria", flag: "🇪🇬" },
    { city: "Giza", flag: "🇪🇬" }, { city: "Sharm El Sheikh", flag: "🇪🇬" },
    { city: "Luxor", flag: "🇪🇬" }, { city: "Aswan", flag: "🇪🇬" },
  ],
  "Turkey 🇹🇷": [
    { city: "Istanbul", flag: "🇹🇷" }, { city: "Ankara", flag: "🇹🇷" },
    { city: "Izmir", flag: "🇹🇷" }, { city: "Bursa", flag: "🇹🇷" },
    { city: "Antalya", flag: "🇹🇷" }, { city: "Adana", flag: "🇹🇷" },
  ],
  "Netherlands 🇳🇱": [
    { city: "Amsterdam", flag: "🇳🇱" }, { city: "Rotterdam", flag: "🇳🇱" },
    { city: "The Hague", flag: "🇳🇱" }, { city: "Utrecht", flag: "🇳🇱" },
    { city: "Eindhoven", flag: "🇳🇱" }, { city: "Tilburg", flag: "🇳🇱" },
  ],
  "Switzerland 🇨🇭": [
    { city: "Zurich", flag: "🇨🇭" }, { city: "Geneva", flag: "🇨🇭" },
    { city: "Basel", flag: "🇨🇭" }, { city: "Bern", flag: "🇨🇭" },
    { city: "Lausanne", flag: "🇨🇭" }, { city: "Lucerne", flag: "🇨🇭" },
  ],
  "New Zealand 🇳🇿": [
    { city: "Auckland", flag: "🇳🇿" }, { city: "Wellington", flag: "🇳🇿" },
    { city: "Christchurch", flag: "🇳🇿" }, { city: "Hamilton", flag: "🇳🇿" },
    { city: "Queenstown", flag: "🇳🇿" }, { city: "Dunedin", flag: "🇳🇿" },
  ],
};

const Favourites: React.FC<FavouritesProps> = ({ onSelectCity, isDark }) => {
  const [savedCities, setSavedCities] = useState<string[]>([]);
  const [newCity, setNewCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'india' | 'world'>('india');
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('climatix_favs');
    if (stored) {
      setSavedCities(JSON.parse(stored));
    } else {
      setSavedCities(['Hyderabad, India', 'Visakhapatnam, India', 'Mumbai, India']);
    }
  }, []);

  const saveToStorage = (cities: string[]) => {
    localStorage.setItem('climatix_favs', JSON.stringify(cities));
    setSavedCities(cities);
  };

  const addCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCity && !savedCities.includes(newCity)) {
      saveToStorage([...savedCities, newCity]);
      setNewCity('');
    }
  };

  const selectCity = (city: string, region: string) => {
    const fullName = `${city}, ${region}`;
    if (!savedCities.some(c => c.toLowerCase() === fullName.toLowerCase())) {
      saveToStorage([...savedCities, fullName]);
    }
    onSelectCity(fullName);
  };

  const removeCity = (city: string) => {
    saveToStorage(savedCities.filter(c => c !== city));
  };

  // Filter function
  const filterCities = (cities: { city: string }[], query: string) => {
    if (!query) return cities;
    return cities.filter(c => c.city.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="relative flex-1 h-full overflow-hidden animate-fade-in">
      <BackgroundEffects isNight={isDark} />

      <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Globe className="text-blue-500" size={24} />
            All Cities
          </h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities..."
            className="w-full py-2.5 pl-10 pr-4 bg-white/70 dark:bg-slate-800/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md border border-white/40 dark:border-slate-700"
          />
        </div>

        {/* Saved Cities */}
        <div className="mb-4 p-3 bg-rose-50/50 dark:bg-rose-900/20 rounded-xl border border-rose-200/50 dark:border-rose-800/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <Heart size={14} className="fill-current" /> My Cities
            </h3>
            <form onSubmit={addCity} className="flex gap-1">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Add..."
                className="px-2 py-1 text-xs bg-white dark:bg-slate-700 rounded-lg border w-24"
              />
              <button type="submit" className="p-1 bg-rose-500 text-white rounded-lg"><Plus size={14} /></button>
            </form>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {savedCities.map((city) => (
              <div key={city} className="group flex items-center gap-1 px-2 py-1 bg-white/80 dark:bg-slate-800/80 rounded-full text-xs">
                <button onClick={() => onSelectCity(city)} className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
                  {city}
                </button>
                <button onClick={() => removeCity(city)} className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('india')}
            className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'india'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/60 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300'
            }`}
          >
            🇮🇳 India States
          </button>
          <button
            onClick={() => setActiveTab('world')}
            className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'world'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/60 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300'
            }`}
          >
            🌍 World Countries
          </button>
        </div>

        {/* Indian States */}
        {activeTab === 'india' && (
          <div className="space-y-2">
            {Object.entries(INDIAN_STATES).map(([state, cities]) => {
              const filtered = filterCities(cities, searchQuery);
              if (searchQuery && filtered.length === 0) return null;
              
              return (
                <div key={state} className="bg-white/50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-white/40 dark:border-slate-700">
                  <button
                    onClick={() => setExpandedState(expandedState === state ? null : state)}
                    className="w-full p-3 flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                      🏛️ {state}
                      <span className="text-xs text-gray-500 dark:text-gray-400">({cities.length} cities)</span>
                    </span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedState === state ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {(expandedState === state || searchQuery) && (
                    <div className="p-2 pt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                      {filtered.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => selectCity(c.city, 'India')}
                          className="p-2 text-left text-sm bg-white/60 dark:bg-slate-700/40 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all flex items-center gap-2"
                        >
                          <MapPin size={12} className="text-orange-500 shrink-0" />
                          <span className="truncate text-gray-700 dark:text-gray-200">{c.city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* World Countries */}
        {activeTab === 'world' && (
          <div className="space-y-2">
            {Object.entries(WORLD_COUNTRIES).map(([country, cities]) => {
              const countryName = country.replace(/\s*[\u{1F1E0}-\u{1F1FF}]+/gu, '').trim();
              const filtered = cities.filter(c => 
                !searchQuery || c.city.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (searchQuery && filtered.length === 0) return null;
              
              return (
                <div key={country} className="bg-white/50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-white/40 dark:border-slate-700">
                  <button
                    onClick={() => setExpandedCountry(expandedCountry === country ? null : country)}
                    className="w-full p-3 flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-800 dark:text-white">
                      {country}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({cities.length} cities)</span>
                    </span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedCountry === country ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {(expandedCountry === country || searchQuery) && (
                    <div className="p-2 pt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                      {filtered.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => selectCity(c.city, countryName)}
                          className="p-2 text-left text-sm bg-white/60 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center gap-2"
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="truncate text-gray-700 dark:text-gray-200">{c.city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
