/* ============================================================
   Qur'an & Hadith Library: the verses and authentic hadith behind
   Adeel's teaching, grouped by theme. Translations are close English
   renderings; every Qur'an entry links to Quran.com and every hadith
   to a Sunnah.com search, so readers can check the source.
   Fields: t = theme, r = reference, a = Arabic (where given), e = English,
           k = "q" (Qur'an) or "h" (hadith), s = collection (hadith)
   ============================================================ */
window.LIBRARY_THEMES = [
  ["dua", "Dua"], ["dhikr", "Dhikr"], ["tawhid", "Tawhid · no power but Allah"], ["tawakkul", "Tawakkul"],
  ["sabr", "Hardship & sabr"], ["tawbah", "Forgiveness"], ["shukr", "Gratitude"], ["rizq", "Rizq"],
  ["marriage", "Marriage & family"], ["healing", "Healing"], ["protection", "Protection"], ["salah", "Salah"],
  ["intention", "Intention & ego"], ["hijra", "Hijra & new beginnings"], ["signs", "Signs in creation"],
  ["qadr", "Qadr"], ["jannah", "Jannah"], ["dawah", "Dawah"]
];

window.LIBRARY = [
  /* ---------- DUA ---------- */
  { k: "q", t: "dua", r: "2:186", a: "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ", e: "And when My servants ask you about Me, I am near. I respond to the call of the caller when he calls upon Me." },
  { k: "q", t: "dua", r: "40:60", a: "ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ", e: "Your Lord has said: Call upon Me; I will respond to you." },
  { k: "q", t: "dua", r: "7:55", a: "ٱدْعُوا۟ رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً", e: "Call upon your Lord humbly and privately. He does not love those who transgress." },
  { k: "q", t: "dua", r: "27:62", a: "أَمَّن يُجِيبُ ٱلْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ ٱلسُّوٓءَ", e: "Who responds to the one in distress when he calls upon Him, and removes the evil?" },
  { k: "q", t: "dua", r: "2:201", a: "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْءَاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ", e: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire." },
  { k: "q", t: "dua", r: "21:87", a: "لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ", e: "The dua of Yunus in the belly of the whale: There is no god but You, glory be to You; I have been among the wrongdoers." },
  { k: "q", t: "dua", r: "21:89", a: "رَبِّ لَا تَذَرْنِى فَرْدًا وَأَنتَ خَيْرُ ٱلْوَٰرِثِينَ", e: "The dua of Zakariyya for a child: My Lord, do not leave me alone, and You are the best of inheritors." },
  { k: "q", t: "dua", r: "20:25-26", a: "رَبِّ ٱشْرَحْ لِى صَدْرِى ۝ وَيَسِّرْ لِىٓ أَمْرِى", e: "The dua of Musa: My Lord, expand my chest for me, and make my task easy for me." },
  { k: "q", t: "dua", r: "20:114", a: "رَّبِّ زِدْنِى عِلْمًا", e: "My Lord, increase me in knowledge." },
  { k: "q", t: "dua", r: "3:8", a: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", e: "Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself." },
  { k: "q", t: "dua", r: "7:23", a: "رَبَّنَا ظَلَمْنَآ أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ ٱلْخَٰسِرِينَ", e: "The dua of Adam and Hawwa: Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers." },
  { k: "q", t: "dua", r: "25:77", e: "Say: My Lord would not concern Himself with you were it not for your supplication." },
  { k: "h", t: "dua", s: "Tirmidhi, Abu Dawud", r: "Dua is worship", e: "Dua is worship itself. Then he recited: “Your Lord has said: Call upon Me; I will respond to you.”" },
  { k: "h", t: "dua", s: "Bukhari, Muslim", r: "Do not be hasty", e: "The dua of any of you is answered as long as he is not hasty, saying: “I made dua, but I was not answered.”" },
  { k: "h", t: "dua", s: "Musnad Ahmad", r: "Three ways of answering", e: "No Muslim makes a dua without sin or cutting ties of kinship except that Allah gives him one of three: He answers it soon, or saves it for him in the Hereafter, or turns away an equal harm from him." },
  { k: "h", t: "dua", s: "Abu Dawud, Tirmidhi", r: "Raised hands", e: "Your Lord is Shy and Generous; He is shy, when His servant raises his hands to Him, to return them empty." },
  { k: "h", t: "dua", s: "Bukhari, Muslim", r: "The last third of the night", e: "Our Lord descends every night to the lowest heaven when the last third of the night remains and says: Who is calling upon Me, that I may answer him? Who is asking of Me, that I may give him? Who is seeking My forgiveness, that I may forgive him?" },
  { k: "h", t: "dua", s: "Muslim", r: "In sujood", e: "The closest a servant is to his Lord is when he is in prostration, so make much dua then." },
  { k: "h", t: "dua", s: "Abu Dawud, Tirmidhi", r: "Between adhan and iqamah", e: "Dua made between the adhan and the iqamah is not rejected." },
  { k: "h", t: "dua", s: "Tirmidhi", r: "The dua of Yunus", e: "The dua of Dhun-Nun (Yunus) in the belly of the whale: “La ilaha illa anta, subhanaka, inni kuntu minaz-zalimin.” No Muslim ever calls upon his Lord with it for anything except that He answers him." },
  { k: "h", t: "dua", s: "Muslim", r: "Dua for your brother", e: "No Muslim makes dua for his brother in his absence except that an angel says: “And for you the same.”" },
  { k: "h", t: "dua", s: "Tirmidhi", r: "Begin with praise", e: "When one of you prays, let him begin by praising and glorifying his Lord, then send blessings on the Prophet ﷺ, then ask for whatever he wishes." },

  /* ---------- DHIKR ---------- */
  { k: "q", t: "dhikr", r: "13:28", a: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", e: "Verily, in the remembrance of Allah do hearts find rest." },
  { k: "q", t: "dhikr", r: "2:152", a: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ", e: "So remember Me; I will remember you. And be grateful to Me and do not deny Me." },
  { k: "q", t: "dhikr", r: "33:41-42", a: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ ٱللَّهَ ذِكْرًا كَثِيرًا", e: "O you who believe, remember Allah with much remembrance, and glorify Him morning and evening." },
  { k: "q", t: "dhikr", r: "29:45", a: "وَلَذِكْرُ ٱللَّهِ أَكْبَرُ", e: "And the remembrance of Allah is greater." },
  { k: "q", t: "dhikr", r: "3:191", e: "Those who remember Allah standing, sitting and lying on their sides, and reflect on the creation of the heavens and the earth: “Our Lord, You did not create this in vain.”" },
  { k: "q", t: "dhikr", r: "33:35", e: "…the men and women who remember Allah often: for them Allah has prepared forgiveness and a great reward." },
  { k: "h", t: "dhikr", s: "Bukhari", r: "The living and the dead", e: "The example of the one who remembers his Lord and the one who does not is like the living and the dead." },
  { k: "h", t: "dhikr", s: "Bukhari, Muslim", r: "Two words", e: "Two words are light on the tongue, heavy on the Scale and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-'Azim." },
  { k: "h", t: "dhikr", s: "Bukhari, Muslim", r: "SubhanAllahi wa bihamdihi ×100", e: "Whoever says “SubhanAllahi wa bihamdihi” a hundred times a day, his sins are wiped away even if they are like the foam of the sea." },
  { k: "h", t: "dhikr", s: "Bukhari, Muslim", r: "Remember Me in yourself", e: "Allah says: I am as My servant thinks of Me, and I am with him when he remembers Me. If he remembers Me in himself, I remember him in Myself; if he remembers Me in a gathering, I remember him in a gathering better than it." },
  { k: "h", t: "dhikr", s: "Tirmidhi", r: "The best dhikr", e: "The best remembrance is La ilaha illallah, and the best dua is Alhamdulillah." },
  { k: "h", t: "dhikr", s: "Muslim", r: "After every salah", e: "Whoever says after every prayer SubhanAllah 33 times, Alhamdulillah 33 times and Allahu Akbar 33 times, and completes the hundred with “La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir”, his sins are forgiven even if they are like the foam of the sea." },

  /* ---------- TAWHID / NO POWER BUT ALLAH ---------- */
  { k: "q", t: "tawhid", r: "18:39", a: "مَا شَآءَ ٱللَّهُ لَا قُوَّةَ إِلَّا بِٱللَّهِ", e: "What Allah wills; there is no power except with Allah." },
  { k: "q", t: "tawhid", r: "112:1-4", a: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", e: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, and there is none comparable to Him." },
  { k: "q", t: "tawhid", r: "42:11", a: "لَيْسَ كَمِثْلِهِۦ شَىْءٌ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ", e: "There is nothing like Him, and He is the All-Hearing, the All-Seeing." },
  { k: "q", t: "tawhid", r: "2:255", a: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", e: "Ayat al-Kursi: Allah, there is no god but Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and the earth…" },
  { k: "q", t: "tawhid", r: "57:3", e: "He is the First and the Last, the Manifest and the Hidden, and He has knowledge of all things." },
  { k: "q", t: "tawhid", r: "7:180", a: "وَلِلَّهِ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ فَٱدْعُوهُ بِهَا", e: "To Allah belong the most beautiful names, so call upon Him by them." },
  { k: "h", t: "tawhid", s: "Bukhari, Muslim", r: "A treasure of Jannah", e: "Shall I not guide you to a treasure from the treasures of Paradise? La hawla wa la quwwata illa billah." },
  { k: "h", t: "tawhid", s: "Tirmidhi", r: "If the whole nation gathered", e: "Be mindful of Allah and He will protect you. When you ask, ask Allah; when you seek help, seek help from Allah. Know that if the whole nation gathered to benefit you, they could only benefit you with what Allah had written for you." },

  /* ---------- TAWAKKUL ---------- */
  { k: "q", t: "tawakkul", r: "65:2-3", a: "وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ", e: "Whoever is mindful of Allah, He will make a way out for him and provide for him from where he does not expect. And whoever relies upon Allah, He is sufficient for him." },
  { k: "q", t: "tawakkul", r: "3:159", a: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى ٱللَّهِ", e: "And when you have decided, rely upon Allah. Indeed, Allah loves those who rely upon Him." },
  { k: "q", t: "tawakkul", r: "3:173", a: "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ", e: "Allah is sufficient for us, and He is the best Disposer of affairs." },
  { k: "q", t: "tawakkul", r: "9:129", a: "حَسْبِىَ ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ", e: "Allah is sufficient for me; there is no god but Him. In Him I put my trust, and He is the Lord of the Great Throne." },
  { k: "q", t: "tawakkul", r: "9:51", a: "قُل لَّن يُصِيبَنَآ إِلَّا مَا كَتَبَ ٱللَّهُ لَنَا", e: "Say: Nothing will befall us except what Allah has written for us. He is our Protector, and upon Allah let the believers rely." },
  { k: "h", t: "tawakkul", s: "Tirmidhi", r: "Like the birds", e: "If you relied upon Allah as He truly deserves, He would provide for you as He provides for the birds: they go out hungry in the morning and return full in the evening." },
  { k: "h", t: "tawakkul", s: "Tirmidhi", r: "Tie your camel", e: "A man asked: Should I tie my camel and trust in Allah, or leave it untied and trust in Allah? He said: Tie it, and trust in Allah." },

  /* ---------- HARDSHIP & SABR ---------- */
  { k: "q", t: "sabr", r: "94:5-6", a: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", e: "For indeed, with hardship comes ease. Indeed, with hardship comes ease." },
  { k: "q", t: "sabr", r: "2:153", e: "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient." },
  { k: "q", t: "sabr", r: "2:155-156", a: "إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ", e: "We will surely test you with something of fear, hunger and loss… and give good tidings to the patient, who, when disaster strikes, say: Indeed we belong to Allah, and to Him we will return." },
  { k: "q", t: "sabr", r: "2:286", a: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", e: "Allah does not burden a soul beyond what it can bear." },
  { k: "q", t: "sabr", r: "12:86", a: "إِنَّمَآ أَشْكُوا۟ بَثِّى وَحُزْنِىٓ إِلَى ٱللَّهِ", e: "Yaqub said: I only complain of my grief and sorrow to Allah." },
  { k: "q", t: "sabr", r: "12:87", e: "And do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people." },
  { k: "q", t: "sabr", r: "93:3-5", e: "Your Lord has not abandoned you, nor has He become displeased. And the Hereafter is better for you than the first. And your Lord is going to give you, and you will be satisfied." },
  { k: "q", t: "sabr", r: "39:10", e: "Indeed, the patient will be given their reward without account." },
  { k: "q", t: "sabr", r: "2:216", e: "Perhaps you dislike something and it is good for you, and perhaps you love something and it is bad for you. Allah knows, and you do not know." },
  { k: "h", t: "sabr", s: "Muslim", r: "The believer's affair", e: "How amazing is the affair of the believer! All of it is good, and that is for no one but the believer: if good befalls him he is grateful, and it is good for him; if harm befalls him he is patient, and it is good for him." },
  { k: "h", t: "sabr", s: "Bukhari, Muslim", r: "Even a thorn", e: "No fatigue, illness, worry, grief, harm or distress befalls a Muslim, not even a thorn that pricks him, except that Allah expiates some of his sins by it." },
  { k: "h", t: "sabr", s: "Tirmidhi", r: "When Allah loves a people", e: "The greatness of the reward is with the greatness of the trial. When Allah loves a people He tests them; whoever is content will have contentment." },
  { k: "h", t: "sabr", s: "Bukhari, Muslim", r: "At the first strike", e: "Patience is at the first strike of calamity." },

  /* ---------- FORGIVENESS ---------- */
  { k: "q", t: "tawbah", r: "39:53", a: "قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ", e: "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. He is the Forgiving, the Merciful." },
  { k: "q", t: "tawbah", r: "2:222", a: "إِنَّ ٱللَّهَ يُحِبُّ ٱلتَّوَّٰبِينَ وَيُحِبُّ ٱلْمُتَطَهِّرِينَ", e: "Indeed, Allah loves those who repent and loves those who purify themselves." },
  { k: "q", t: "tawbah", r: "71:10-12", e: "Ask forgiveness of your Lord; He is ever Forgiving. He will send rain upon you in abundance, give you wealth and children, and provide you gardens and rivers." },
  { k: "q", t: "tawbah", r: "25:70", e: "Except for those who repent, believe and do righteous deeds: for them Allah will replace their evil deeds with good." },
  { k: "q", t: "tawbah", r: "11:3", e: "Seek forgiveness of your Lord and repent to Him; He will let you enjoy a good provision for an appointed term." },
  { k: "h", t: "tawbah", s: "Muslim", r: "His hand is stretched out", e: "Allah stretches out His hand at night so that those who sinned by day may repent, and stretches out His hand by day so that those who sinned by night may repent, until the sun rises from the west." },
  { k: "h", t: "tawbah", s: "Tirmidhi", r: "The best of those who err", e: "Every son of Adam errs, and the best of those who err are those who repent." },
  { k: "h", t: "tawbah", s: "Bukhari", r: "Seventy times a day", e: "By Allah, I seek Allah's forgiveness and repent to Him more than seventy times a day." },
  { k: "h", t: "tawbah", s: "Tirmidhi", r: "O son of Adam", e: "Allah says: O son of Adam, as long as you call upon Me and hope in Me, I will forgive you whatever you have done, and I do not mind." },
  { k: "h", t: "tawbah", s: "Bukhari", r: "Sayyid al-Istighfar", e: "The master of seeking forgiveness is: “O Allah, You are my Lord; there is no god but You. You created me and I am Your servant…” Whoever says it in the day with firm faith and dies that day before evening is among the people of Paradise." },

  /* ---------- GRATITUDE ---------- */
  { k: "q", t: "shukr", r: "14:7", a: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", e: "If you are grateful, I will surely increase you." },
  { k: "q", t: "shukr", r: "55:13", a: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ", e: "So which of the favours of your Lord would you deny?" },
  { k: "q", t: "shukr", r: "16:18", e: "And if you tried to count the favours of Allah, you could never number them. Indeed, Allah is Forgiving and Merciful." },
  { k: "h", t: "shukr", s: "Abu Dawud, Tirmidhi", r: "Thank people", e: "Whoever does not thank people has not thanked Allah." },
  { k: "h", t: "shukr", s: "Bukhari, Muslim", r: "Real richness", e: "Richness is not having many possessions; true richness is the richness of the soul." },

  /* ---------- RIZQ ---------- */
  { k: "q", t: "rizq", r: "51:58", a: "إِنَّ ٱللَّهَ هُوَ ٱلرَّزَّاقُ ذُو ٱلْقُوَّةِ ٱلْمَتِينُ", e: "Indeed, it is Allah who is the Provider, the Possessor of strength, the Firm." },
  { k: "q", t: "rizq", r: "11:6", e: "There is no creature on earth except that its provision is upon Allah." },
  { k: "q", t: "rizq", r: "28:24", a: "رَبِّ إِنِّى لِمَآ أَنزَلْتَ إِلَىَّ مِنْ خَيْرٍ فَقِيرٌ", e: "The dua of Musa: My Lord, I am truly in need of whatever good You send down to me." },
  { k: "q", t: "rizq", r: "2:261", e: "The example of those who spend their wealth in the way of Allah is like a seed that grows seven ears, in each ear a hundred grains. And Allah multiplies for whom He wills." },
  { k: "q", t: "rizq", r: "34:39", e: "Whatever you spend of anything, He will replace it, and He is the best of providers." },
  { k: "q", t: "rizq", r: "62:10", e: "And when the prayer is concluded, disperse in the land and seek from the bounty of Allah, and remember Allah often so that you may succeed." },
  { k: "h", t: "rizq", s: "Muslim", r: "Charity never decreases wealth", e: "Charity does not decrease wealth, Allah increases in honour the one who forgives, and no one humbles himself for Allah except that Allah raises him." },
  { k: "h", t: "rizq", s: "Bukhari, Muslim", r: "Keeping family ties", e: "Whoever would like his provision to be increased and his life extended, let him keep the ties of kinship." },
  { k: "h", t: "rizq", s: "Ibn Majah", r: "After Fajr", e: "After Fajr he would say: O Allah, I ask You for beneficial knowledge, good provision and accepted deeds." },

  /* ---------- MARRIAGE & FAMILY ---------- */
  { k: "q", t: "marriage", r: "30:21", a: "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً", e: "And among His signs is that He created for you spouses from among yourselves so that you may find tranquillity in them, and He placed between you affection and mercy." },
  { k: "q", t: "marriage", r: "25:74", a: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", e: "Our Lord, grant us from our spouses and children the coolness of our eyes, and make us leaders of the righteous." },
  { k: "q", t: "marriage", r: "2:187", e: "They are a garment for you, and you are a garment for them." },
  { k: "q", t: "marriage", r: "4:19", e: "And live with them in kindness." },
  { k: "q", t: "marriage", r: "17:23-24", a: "رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا", e: "Be good to your parents… and say: My Lord, have mercy on them as they raised me when I was small." },
  { k: "h", t: "marriage", s: "Tirmidhi", r: "Religion and character", e: "When someone whose religion and character please you proposes to your daughter, marry her to him." },
  { k: "h", t: "marriage", s: "Bukhari, Muslim", r: "Choose for religion", e: "A woman is married for four things: her wealth, her lineage, her beauty and her religion. Choose the one with religion and you will prosper." },
  { k: "h", t: "marriage", s: "Tirmidhi", r: "Best to their families", e: "The best of you are those who are best to their families, and I am the best of you to my family." },

  /* ---------- HEALING ---------- */
  { k: "q", t: "healing", r: "26:80", a: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", e: "And when I am ill, it is He who heals me." },
  { k: "q", t: "healing", r: "17:82", e: "And We send down of the Qur'an that which is healing and mercy for the believers." },
  { k: "q", t: "healing", r: "10:57", e: "O mankind, there has come to you instruction from your Lord and healing for what is in the hearts, and guidance and mercy for the believers." },
  { k: "q", t: "healing", r: "21:83", a: "أَنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ", e: "The dua of Ayyub: Harm has touched me, and You are the Most Merciful of the merciful." },
  { k: "h", t: "healing", s: "Bukhari", r: "Every disease has a cure", e: "Allah has not sent down any disease except that He has also sent down its cure." },
  { k: "h", t: "healing", s: "Bukhari", r: "The Prophet's ruqyah", e: "Remove the harm, Lord of mankind, and heal, for You are the Healer. There is no healing except Your healing, a healing that leaves no illness." },
  { k: "h", t: "healing", s: "Muslim", r: "Hand on the pain", e: "Put your hand on the place that hurts and say Bismillah three times, then seven times: I seek refuge in the might and power of Allah from the evil of what I feel and fear." },
  { k: "h", t: "healing", s: "Bukhari", r: "Al-Fatihah as ruqyah", e: "A Companion recited Al-Fatihah over a man who had been stung, and he recovered. The Prophet ﷺ said: How did you know it is a ruqyah?" },

  /* ---------- PROTECTION ---------- */
  { k: "q", t: "protection", r: "113:1-5", a: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", e: "Say: I seek refuge in the Lord of the daybreak, from the evil of what He created… and from the evil of the envier when he envies." },
  { k: "q", t: "protection", r: "114:1-6", a: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", e: "Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the retreating whisperer." },
  { k: "q", t: "protection", r: "7:200", a: "وَإِمَّا يَنزَغَنَّكَ مِنَ ٱلشَّيْطَٰنِ نَزْغٌ فَٱسْتَعِذْ بِٱللَّهِ", e: "And if an evil suggestion comes to you from Shaytan, seek refuge in Allah. Indeed, He is All-Hearing, All-Knowing." },
  { k: "q", t: "protection", r: "15:42", e: "Indeed, over My servants you will have no authority, except those who follow you of the deviators." },
  { k: "q", t: "protection", r: "12:64", a: "فَٱللَّهُ خَيْرٌ حَٰفِظًا ۖ وَهُوَ أَرْحَمُ ٱلرَّٰحِمِينَ", e: "Allah is the best guardian, and He is the Most Merciful of the merciful." },
  { k: "q", t: "protection", r: "68:51", e: "And those who disbelieve would almost make you slip with their eyes when they hear the message." },
  { k: "h", t: "protection", s: "Muslim", r: "The eye is real", e: "The evil eye is real. If anything could precede the decree, it would be the evil eye." },
  { k: "h", t: "protection", s: "Ibn Majah, Muwatta", r: "Pray for blessing", e: "Why would one of you harm his brother? When you see something you like, pray for blessing on it." },
  { k: "h", t: "protection", s: "Abu Dawud, Tirmidhi", r: "The three Quls", e: "Recite “Qul huwa Allahu ahad” and the two surahs of refuge three times morning and evening; they will suffice you against everything." },
  { k: "h", t: "protection", s: "Abu Dawud, Tirmidhi", r: "In the name of Allah", e: "Whoever says three times morning and evening: “In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing,” nothing will harm him." },
  { k: "h", t: "protection", s: "Bukhari", r: "Ayat al-Kursi before sleep", e: "When you go to bed, recite Ayat al-Kursi; a guardian from Allah will stay with you and no devil will come near you until morning." },
  { k: "h", t: "protection", s: "Muslim", r: "Surah al-Baqarah at home", e: "Do not make your houses graves. Shaytan flees from the house in which Surah al-Baqarah is recited." },
  { k: "h", t: "protection", s: "Bukhari", r: "For your children", e: "He sought refuge for Hasan and Husayn: I seek refuge for you both in the perfect words of Allah, from every devil and harmful creature and from every evil eye." },

  /* ---------- SALAH ---------- */
  { k: "q", t: "salah", r: "2:45", a: "وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ", e: "And seek help through patience and prayer." },
  { k: "q", t: "salah", r: "20:14", a: "وَأَقِمِ ٱلصَّلَوٰةَ لِذِكْرِىٓ", e: "And establish prayer for My remembrance." },
  { k: "q", t: "salah", r: "23:1-2", a: "قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ ۝ ٱلَّذِينَ هُمْ فِى صَلَاتِهِمْ خَٰشِعُونَ", e: "Successful indeed are the believers, those who are humble in their prayer." },
  { k: "q", t: "salah", r: "29:45", e: "Indeed, prayer prohibits immorality and wrongdoing." },
  { k: "q", t: "salah", r: "14:40", a: "رَبِّ ٱجْعَلْنِى مُقِيمَ ٱلصَّلَوٰةِ وَمِن ذُرِّيَّتِى", e: "The dua of Ibrahim: My Lord, make me an establisher of prayer, and from my descendants." },
  { k: "h", t: "salah", s: "Bukhari", r: "Pray as you have seen me pray", e: "Pray as you have seen me praying." },
  { k: "h", t: "salah", s: "Bukhari, Muslim", r: "A river at your door", e: "If there were a river at the door of one of you in which he bathed five times a day, would any dirt remain on him? That is the example of the five prayers: Allah wipes away sins by them." },
  { k: "h", t: "salah", s: "Tirmidhi, Abu Dawud", r: "The first thing judged", e: "The first of his deeds for which a servant will be called to account on the Day of Resurrection is his prayer." },
  { k: "h", t: "salah", s: "Nasa'i", r: "Coolness of my eyes", e: "The coolness of my eyes has been placed in prayer." },

  /* ---------- INTENTION & EGO ---------- */
  { k: "q", t: "intention", r: "13:11", a: "إِنَّ ٱللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا۟ مَا بِأَنفُسِهِمْ", e: "Indeed, Allah will not change the condition of a people until they change what is in themselves." },
  { k: "q", t: "intention", r: "91:9-10", a: "قَدْ أَفْلَحَ مَن زَكَّىٰهَا ۝ وَقَدْ خَابَ مَن دَسَّىٰهَا", e: "Successful is the one who purifies the soul, and failed is the one who corrupts it." },
  { k: "q", t: "intention", r: "98:5", e: "And they were not commanded except to worship Allah, sincere to Him in religion." },
  { k: "q", t: "intention", r: "25:63", e: "And the servants of the Most Merciful are those who walk upon the earth humbly, and when the ignorant address them, they say words of peace." },
  { k: "q", t: "intention", r: "31:18", e: "And do not turn your cheek away from people in arrogance, nor walk through the earth exultantly. Allah does not love the arrogant and boastful." },
  { k: "h", t: "intention", s: "Bukhari, Muslim", r: "Actions are by intentions", e: "Actions are only by intentions, and everyone will have what he intended. Whoever's hijra was for Allah and His Messenger, his hijra is for Allah and His Messenger." },
  { k: "h", t: "intention", s: "Muslim", r: "An atom of arrogance", e: "No one will enter Paradise who has an atom's weight of arrogance in his heart. Arrogance is rejecting the truth and looking down on people." },
  { k: "h", t: "intention", s: "Bukhari, Muslim", r: "As My servant thinks of Me", e: "Allah says: I am as My servant thinks of Me." },
  { k: "h", t: "intention", s: "Muslim", r: "Ihsan", e: "Ihsan is to worship Allah as though you see Him, and if you do not see Him, He sees you." },

  /* ---------- HIJRA ---------- */
  { k: "q", t: "hijra", r: "9:40", a: "لَا تَحْزَنْ إِنَّ ٱللَّهَ مَعَنَا", e: "When they were both in the cave, he said to his companion: Do not grieve; indeed Allah is with us." },
  { k: "q", t: "hijra", r: "4:100", e: "Whoever emigrates for the cause of Allah will find on the earth many places of refuge and abundance." },
  { k: "h", t: "hijra", s: "Bukhari, Muslim", r: "Two, with Allah the third", e: "Abu Bakr said: If one of them looked at his feet, he would see us. He ﷺ said: What do you think of two when Allah is their third?" },

  /* ---------- SIGNS ---------- */
  { k: "q", t: "signs", r: "3:190", a: "إِنَّ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَٰفِ ٱلَّيْلِ وَٱلنَّهَارِ لَءَايَٰتٍ لِّأُو۟لِى ٱلْأَلْبَٰبِ", e: "Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for people of understanding." },
  { k: "q", t: "signs", r: "36:39", a: "وَٱلْقَمَرَ قَدَّرْنَٰهُ مَنَازِلَ حَتَّىٰ عَادَ كَٱلْعُرْجُونِ ٱلْقَدِيمِ", e: "And the moon We have measured in phases, until it returns like an old, curved palm stalk." },
  { k: "q", t: "signs", r: "41:53", e: "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth." },
  { k: "q", t: "signs", r: "6:97", e: "And it is He who placed for you the stars, so that you may be guided by them through the darknesses of land and sea." },
  { k: "q", t: "signs", r: "10:5", e: "It is He who made the sun a shining light and the moon a reflected light, and determined for it phases, so that you may know the number of years and the reckoning." },

  /* ---------- QADR ---------- */
  { k: "q", t: "qadr", r: "54:49", a: "إِنَّا كُلَّ شَىْءٍ خَلَقْنَٰهُ بِقَدَرٍ", e: "Indeed, We created all things with predestination." },
  { k: "q", t: "qadr", r: "57:22-23", e: "No disaster strikes on earth or among yourselves except that it is in a register before We bring it into being… so that you do not despair over what has escaped you, nor exult over what He has given you." },
  { k: "h", t: "qadr", s: "Tirmidhi, Ibn Majah", r: "Only dua turns back the decree", e: "Nothing turns back the decree except dua, and nothing increases one's lifespan except righteousness." },
  { k: "h", t: "qadr", s: "Muslim", r: "Do not say “if only”", e: "Strive for what benefits you, seek help from Allah and do not give up. If something befalls you, do not say “If only I had done…” but say: Allah decreed, and what He willed, He did." },

  /* ---------- JANNAH ---------- */
  { k: "q", t: "jannah", r: "18:107", a: "إِنَّ ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ كَانَتْ لَهُمْ جَنَّٰتُ ٱلْفِرْدَوْسِ نُزُلًا", e: "Indeed, those who believe and do righteous deeds will have the Gardens of Firdaws as a lodging." },
  { k: "q", t: "jannah", r: "32:17", e: "No soul knows what has been hidden for them of the comfort of eyes, as reward for what they used to do." },
  { k: "q", t: "jannah", r: "3:133", e: "And hasten to forgiveness from your Lord and a garden as wide as the heavens and the earth, prepared for the righteous." },
  { k: "q", t: "jannah", r: "89:27-28", a: "يَٰٓأَيَّتُهَا ٱلنَّفْسُ ٱلْمُطْمَئِنَّةُ ۝ ٱرْجِعِىٓ إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً", e: "O reassured soul, return to your Lord, well-pleased and pleasing to Him." },
  { k: "h", t: "jannah", s: "Bukhari", r: "Ask for al-Firdaws", e: "When you ask Allah, ask Him for al-Firdaws, for it is the middle and highest part of Paradise, and above it is the Throne of the Most Merciful." },
  { k: "h", t: "jannah", s: "Bukhari, Muslim", r: "No eye has seen", e: "Allah says: I have prepared for My righteous servants what no eye has seen, no ear has heard, and no heart has imagined." },
  { k: "h", t: "jannah", s: "Muslim", r: "The path of knowledge", e: "Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise." },

  /* ---------- DAWAH ---------- */
  { k: "q", t: "dawah", r: "16:125", e: "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best." },
  { k: "q", t: "dawah", r: "41:33", e: "And who is better in speech than one who invites to Allah, does righteousness and says: Indeed, I am of the Muslims." },
  { k: "h", t: "dawah", s: "Bukhari", r: "Convey even one verse", e: "Convey from me, even if it is one verse." },
  { k: "h", t: "dawah", s: "Muslim", r: "Guiding to good", e: "Whoever guides someone to goodness will have a reward like the one who does it." }
];
