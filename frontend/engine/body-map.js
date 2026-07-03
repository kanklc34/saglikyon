// ============================================
// SağlıkYön – Body Map Drill-Down v2.2 (i18n + derinlik düzeltmesi)
// ============================================

import { STRINGS } from './i18n.js';

const DRILL_DOWN_TR = {

    // ── ÖN GÖRÜNÜM ────────────────────────────

    'baş': {
        label: 'Baş',
        icon: 'face',
        soru: 'Baştaki şikayet ne?',
        seçenekler: {
            'Baş ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Zonklayan baş ağrısı': null,
                    'Bant gibi sıkıştıran baş ağrısı': null,
                    'Bir taraflı baş ağrısı': null,
                    'Sabah kalktığımda baş ağrısı': null,
                    'Öksürünce artan baş ağrısı': null,
                }
            },
            'Baş dönmesi': {
                soru: 'Baş dönmesi nasıl?',
                seçenekler: {
                    'Etraf dönüyor hissi (vertigo)': null,
                    'Sersemlik, dengesizlik': null,
                    'Ayağa kalkınca baş dönmesi': null,
                }
            },
            'Görme bozukluğu': {
                soru: 'Görme sorunu?',
                seçenekler: {
                    'Bulanık görme': null,
                    'Çift görme': null,
                    'Işığa karşı hassasiyet': null,
                    'Görme alanında kararma': null,
                }
            },
            'Yüz ağrısı / şişliği': {
                soru: 'Yüz şikayetiniz nasıl?',
                seçenekler: {
                    'Yüzün bir tarafında ani uyuşma veya düşme': null,
                    'Sinüslerde basınç, öne eğilince artan ağrı': null,
                    'Diş köküne yakın bölgede şişlik ve hassasiyet': null,
                }
            },
            'Kulak ağrısı': {
                soru: 'Kulak ağrısı nasıl?',
                seçenekler: {
                    'Kulak akıntısı veya işitme kaybıyla birlikte': null,
                    'Çene hareketiyle artan ağrı': null,
                    'Yüzme sonrası başlayan ağrı': null,
                }
            },
            'Kulakta çınlama': {
                soru: 'Çınlama nasıl?',
                seçenekler: {
                    'Ani işitme kaybıyla birlikte başladı': null,
                    'Sürekli, günlerdir/haftalardır devam ediyor': null,
                    'Baş dönmesiyle birlikte': null,
                }
            },
        }
    },

    'boyun': {
        label: 'Boyun',
        icon: 'accessibility_new',
        soru: 'Boyundaki şikayet ne?',
        seçenekler: {
            'Boyun ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Sabah tutulması, harekette ağrı': null,
                    'Kola ya da omuza yayılan ağrı': null,
                    'Sürekli, gün boyu devam eden ağrı': null,
                }
            },
            'Boğaz ağrısı': {
                soru: 'Boğaz şikayeti?',
                seçenekler: {
                    'Yutkunurken ağrı': null,
                    'Boğazda şişlik hissi': null,
                    'Ses kısıklığı': null,
                }
            },
            'Boyunda şişlik / kitle': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Ateş ve boğaz ağrısıyla birlikte (lenf bezi şişliği)': null,
                    'Ağrısız, sertçe, büyüyen bir şişlik': null,
                    'Hızla büyüyen, kızarık ve hassas şişlik': null,
                }
            },
            'Nefes yutma güçlüğü': {
                soru: 'Güçlük nasıl?',
                seçenekler: {
                    'Ani başladı, boğulma hissi var': null,
                    'Yutkunurken takılma hissi': null,
                    'Alerjik bir şeyle (yemek/ilaç) temas sonrası başladı': null,
                }
            },
        }
    },

    'göğüs': {
        label: 'Göğüs',
        icon: 'favorite',
        soru: 'Göğüsteki şikayet ne?',
        seçenekler: {
            'Göğüs ağrısı': {
                soru: 'Ağrı nasıl hissettiriyor?',
                seçenekler: {
                    'Sıkışma, baskı hissi': null,
                    'Yanma, ateş gibi': null,
                    'Bıçak saplanır gibi keskin': null,
                    'Kola ya da çeneye yayılan': null,
                    'Öne eğilince azalan': null,
                }
            },
            'Nefes darlığı': {
                soru: 'Nefes darlığı ne zaman?',
                seçenekler: {
                    'Eforla (yürüyünce, merdiven çıkınca)': null,
                    'İstirahatte de var': null,
                    'Yatar pozisyonda daha kötü': null,
                    'Ani başladı': null,
                }
            },
            'Çarpıntı': {
                soru: 'Çarpıntı nasıl?',
                seçenekler: {
                    'Hızlı ama düzenli': null,
                    'Düzensiz, atlıyor hissi': null,
                    'Ani başlayıp biten': null,
                }
            },
            'Öksürük': {
                soru: 'Öksürük nasıl?',
                seçenekler: {
                    'Kuru öksürük': null,
                    'Balgamlı öksürük': null,
                    'Kanlı balgam': null,
                    'Gece artan öksürük': null,
                }
            },
        }
    },

    'karın üst': {
        label: 'Karın Üst',
        icon: 'airline_seat_flat',
        soru: 'Üst karın şikayeti ne?',
        seçenekler: {
            'Mide ağrısı': {
                soru: 'Ne zaman oluyor?',
                seçenekler: {
                    'Aç karnına daha kötü': null,
                    'Yemekten sonra kötüleşiyor': null,
                    'Yağlı yemek sonrası': null,
                    'Sürekli devam ediyor': null,
                }
            },
            'Mide yanması / reflü': {
                soru: 'Reflü şikayetiniz nasıl?',
                seçenekler: {
                    'Yatınca / eğilince artan yanma': null,
                    'Ağza acı su gelmesi': null,
                    'Yutma sırasında batma hissi': null,
                }
            },
            'Bulantı': {
                soru: 'Bulantı tek başına mı?',
                seçenekler: {
                    'Sadece bulantı var': null,
                    'Kusmayla birlikte': null,
                    'Baş dönmesiyle birlikte': null,
                }
            },
            'Şişkinlik / gaz': {
                soru: 'Şişkinlik nasıl?',
                seçenekler: {
                    'Yemeklerden sonra artan şişkinlik': null,
                    'Dışkılama ile rahatlayan şişkinlik': null,
                    'Karında sertlik ve gerginlik hissi': null,
                }
            },
            'Sarılık (cilt/göz sarardı)': {
                soru: 'Sarılıkla birlikte ne var?',
                seçenekler: {
                    'Koyu renkli idrar': null,
                    'Açık renkli (beyazımsı) dışkı': null,
                    'Karın sağ üst kısmında ağrı': null,
                }
            },
        }
    },

    'karın alt': {
        label: 'Karın Alt',
        icon: 'airline_seat_flat',
        soru: 'Alt karın şikayeti ne?',
        seçenekler: {
            'Karın ağrısı': {
                soru: 'Ağrı nerede?',
                seçenekler: {
                    'Sağ alt karın (apandis bölgesi)': null,
                    'Sol alt karın': null,
                    'Tüm alt karın': null,
                    'Kramp şeklinde gelip geçen': null,
                }
            },
            'İshal': {
                soru: 'İshal nasıl?',
                seçenekler: {
                    'Sulu, sık tuvalete gidiyorum': null,
                    'Kanlı ishal': null,
                    'Mukuslu (sümüksü) dışkı': null,
                }
            },
            'Kabızlık': {
                soru: 'Kabızlık ne kadar süredir?',
                seçenekler: {
                    'Birkaç gündür, karın şişliğiyle birlikte': null,
                    'Uzun süredir devam eden kronik kabızlık': null,
                    'Dışkıda kan veya şiddetli karın ağrısı ile birlikte': null,
                }
            },
            'İdrar şikayeti': {
                soru: 'İdrar şikayeti?',
                seçenekler: {
                    'İdrar yaparken yanma': null,
                    'Sık idrara çıkma': null,
                    'İdrarda kan': null,
                    'İdrar yapamıyorum': null,
                }
            },
        }
    },

    'kasık sol': {
        label: 'Sol Kasık',
        icon: 'airline_seat_flat',
        soru: 'Sol kasık şikayeti?',
        seçenekler: {
            'Kasık ağrısı sol': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Ayakta dururken artan, yatınca geçen şişlikle birlikte (fıtık şüphesi)': null,
                    'Ani başlayan, çok şiddetli ağrı': null,
                    'Hareketle artan, kasık bölgesinde gerginlik': null,
                }
            },
            'Sol kasıkta şişlik': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Ayakta büyüyen, yatınca kaybolan şişlik': null,
                    'Sabit, büyümeyen küçük şişlik': null,
                    'Ağrılı, kızarık ve hassas şişlik': null,
                }
            },
            'İdrar yaparken ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Yanma hissi ile birlikte': null,
                    'Sık idrara çıkma ile birlikte': null,
                    'İdrarda kan ile birlikte': null,
                }
            },
        }
    },

    'kasık sağ': {
        label: 'Sağ Kasık',
        icon: 'airline_seat_flat',
        soru: 'Sağ kasık şikayeti?',
        seçenekler: {
            'Kasık ağrısı sağ': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Ayakta dururken artan, yatınca geçen şişlikle birlikte (fıtık şüphesi)': null,
                    'Ani başlayan, çok şiddetli ağrı': null,
                    'Hareketle artan, kasık bölgesinde gerginlik': null,
                }
            },
            'Sağ kasıkta şişlik': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Ayakta büyüyen, yatınca kaybolan şişlik': null,
                    'Sabit, büyümeyen küçük şişlik': null,
                    'Ağrılı, kızarık ve hassas şişlik': null,
                }
            },
            'Apandis bölgesinde ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Göbek çevresinde başlayıp sağ alt karına kayan ağrı': null,
                    'Öksürünce veya basınca artan ağrı': null,
                    'Ateş ve iştahsızlıkla birlikte': null,
                }
            },
        }
    },

    'sol omuz': {
        label: 'Sol Omuz',
        icon: 'accessibility_new',
        soru: 'Sol omuz şikayeti?',
        seçenekler: {
            'Sol omuz ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan ağrı': null,
                    'İstirahatte de devam eden': null,
                    'Kola yayılan ağrı': null,
                }
            },
            'Sol omuz sertliği': {
                soru: 'Sertlik nasıl?',
                seçenekler: {
                    'Sabah daha kötü, gün içinde azalan': null,
                    'Kolu belirli bir açıdan kaldıramama': null,
                    'Travma (çarpma/düşme) sonrası başladı': null,
                }
            },
            'Sol kol kaldırınca ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Kolu yana kaldırırken belirli bir noktada ağrı': null,
                    'Kolu başın üzerine kaldıramama': null,
                    'Gece yatarken o tarafa yatamama': null,
                }
            },
            'Sol omuz şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Travma sonrası oluşan şişlik': null,
                    'Kızarıklık ve ısı artışıyla birlikte': null,
                    'Yavaşça büyüyen, ağrısız şişlik': null,
                }
            },
        }
    },

    'sağ omuz': {
        label: 'Sağ Omuz',
        icon: 'accessibility_new',
        soru: 'Sağ omuz şikayeti?',
        seçenekler: {
            'Sağ omuz ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan ağrı': null,
                    'İstirahatte de devam eden': null,
                    'Kola yayılan ağrı': null,
                }
            },
            'Sağ omuz sertliği': {
                soru: 'Sertlik nasıl?',
                seçenekler: {
                    'Sabah daha kötü, gün içinde azalan': null,
                    'Kolu belirli bir açıdan kaldıramama': null,
                    'Travma (çarpma/düşme) sonrası başladı': null,
                }
            },
            'Sağ kol kaldırınca ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Kolu yana kaldırırken belirli bir noktada ağrı': null,
                    'Kolu başın üzerine kaldıramama': null,
                    'Gece yatarken o tarafa yatamama': null,
                }
            },
            'Sağ omuz şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Travma sonrası oluşan şişlik': null,
                    'Kızarıklık ve ısı artışıyla birlikte': null,
                    'Yavaşça büyüyen, ağrısız şişlik': null,
                }
            },
        }
    },

    'sol kol üst': {
        label: 'Sol Üst Kol',
        icon: 'back_hand',
        soru: 'Sol kol şikayeti?',
        seçenekler: {
            'Ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan ağrı': null,
                    'İstirahatte de devam eden': null,
                    'Göğüsten yayılan ağrı': null,
                }
            },
            'Güçsüzlük': {
                soru: 'Güçsüzlük nasıl?',
                seçenekler: {
                    'Ani başlayan, yüzde de güçsüzlükle birlikte': null,
                    'Belirli bir harekette ortaya çıkan güçsüzlük': null,
                    'Yavaşça artan, günlerdir devam eden güçsüzlük': null,
                }
            },
            'Uyuşma / karıncalanma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Boyun hareketiyle artan uyuşma': null,
                    'Elin belirli parmaklarında uyuşma': null,
                    'Göğüs ağrısıyla birlikte ani başlayan uyuşma': null,
                }
            },
        }
    },

    'sol ön kol': {
        label: 'Sol Ön Kol',
        icon: 'back_hand',
        soru: 'Sol ön kol şikayeti?',
        seçenekler: {
            'Ön kol ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Tekrarlayan el/bilek hareketleriyle artan ağrı': null,
                    'Travma (çarpma/düşme) sonrası başlayan ağrı': null,
                    'Göğüsten kola yayılan ağrı': null,
                }
            },
            'Uyuşma / karıncalanma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Gece artan uyuşma': null,
                    'Sürekli devam eden uyuşma': null,
                    'Boyun hareketiyle artan uyuşma': null,
                }
            },
            'Kas krampı': {
                soru: 'Kramp nasıl?',
                seçenekler: {
                    'Egzersiz sonrası oluşan kramp': null,
                    'Gece uykuda oluşan kramp': null,
                    'Sık tekrarlayan, günlerdir devam eden kramp': null,
                }
            },
        }
    },

    'sol el': {
        label: 'Sol El / Bilek',
        icon: 'back_hand',
        soru: 'Sol el / bilek şikayeti?',
        seçenekler: {
            'El ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Eklemlerde sabah sertliğiyle birlikte ağrı': null,
                    'Travma (çarpma/düşme) sonrası başlayan ağrı': null,
                    'Tekrarlayan hareketlerle (yazma, klavye vb.) artan ağrı': null,
                }
            },
            'Bilek ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Travma sonrası şişlikle birlikte ağrı': null,
                    'Tekrarlayan hareketlerle artan ağrı': null,
                    'Sabah sertliğiyle birlikte ağrı': null,
                }
            },
            'El uyuşması': {
                soru: 'Uyuşma ne zaman?',
                seçenekler: {
                    'Gece uyurken uyuşuyor': null,
                    'Sürekli uyuşuyor': null,
                    'Belirli pozisyonda uyuşuyor': null,
                }
            },
            'El titremesi': {
                soru: 'Titreme nasıl?',
                seçenekler: {
                    'İstirahatte ortaya çıkan titreme': null,
                    'Bir şey tutmaya çalışırken artan titreme': null,
                    'Stres veya heyecanla artan titreme': null,
                }
            },
        }
    },

    'sağ kol üst': {
        label: 'Sağ Üst Kol',
        icon: 'back_hand',
        soru: 'Sağ kol şikayeti?',
        seçenekler: {
            'Ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan ağrı': null,
                    'İstirahatte de devam eden': null,
                    'Boyun veya sırttan yayılan ağrı': null,
                }
            },
            'Güçsüzlük': {
                soru: 'Güçsüzlük nasıl?',
                seçenekler: {
                    'Ani başlayan, yüzde de güçsüzlükle birlikte': null,
                    'Belirli bir harekette ortaya çıkan güçsüzlük': null,
                    'Yavaşça artan, günlerdir devam eden güçsüzlük': null,
                }
            },
            'Uyuşma / karıncalanma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Boyun hareketiyle artan uyuşma': null,
                    'Elin belirli parmaklarında uyuşma': null,
                    'Göğüs ağrısıyla birlikte ani başlayan uyuşma': null,
                }
            },
        }
    },

    'sağ ön kol': {
        label: 'Sağ Ön Kol',
        icon: 'back_hand',
        soru: 'Sağ ön kol şikayeti?',
        seçenekler: {
            'Ön kol ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Tekrarlayan el/bilek hareketleriyle artan ağrı': null,
                    'Travma (çarpma/düşme) sonrası başlayan ağrı': null,
                    'Göğüsten kola yayılan ağrı': null,
                }
            },
            'Uyuşma / karıncalanma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Gece artan uyuşma': null,
                    'Sürekli devam eden uyuşma': null,
                    'Boyun hareketiyle artan uyuşma': null,
                }
            },
            'Kas krampı': {
                soru: 'Kramp nasıl?',
                seçenekler: {
                    'Egzersiz sonrası oluşan kramp': null,
                    'Gece uykuda oluşan kramp': null,
                    'Sık tekrarlayan, günlerdir devam eden kramp': null,
                }
            },
        }
    },

    'sağ el': {
        label: 'Sağ El / Bilek',
        icon: 'back_hand',
        soru: 'Sağ el / bilek şikayeti?',
        seçenekler: {
            'El ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Eklemlerde sabah sertliğiyle birlikte ağrı': null,
                    'Travma (çarpma/düşme) sonrası başlayan ağrı': null,
                    'Tekrarlayan hareketlerle (yazma, klavye vb.) artan ağrı': null,
                }
            },
            'Bilek ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Travma sonrası şişlikle birlikte ağrı': null,
                    'Tekrarlayan hareketlerle artan ağrı': null,
                    'Sabah sertliğiyle birlikte ağrı': null,
                }
            },
            'El uyuşması': {
                soru: 'Uyuşma ne zaman?',
                seçenekler: {
                    'Gece uyurken uyuşuyor': null,
                    'Sürekli uyuşuyor': null,
                    'Belirli pozisyonda uyuşuyor': null,
                }
            },
            'El titremesi': {
                soru: 'Titreme nasıl?',
                seçenekler: {
                    'İstirahatte ortaya çıkan titreme': null,
                    'Bir şey tutmaya çalışırken artan titreme': null,
                    'Stres veya heyecanla artan titreme': null,
                }
            },
        }
    },

    'sol uyluk': {
        label: 'Sol Uyluk',
        icon: 'directions_walk',
        soru: 'Sol uyluk şikayeti?',
        seçenekler: {
            'Uyluk ağrısı': {
                soru: 'Ne zaman oluyor?',
                seçenekler: {
                    'Yürüyünce ortaya çıkıyor': null,
                    'Dinlenince geçiyor': null,
                    'Sürekli var': null,
                }
            },
            'Uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Uzun süre oturunca ortaya çıkan uyuşma': null,
                    'Sürekli devam eden uyuşma': null,
                }
            },
            'Şişlik': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Tek bacakta, ağrı ve kızarıklıkla birlikte (pıhtı şüphesi)': null,
                    'Her iki bacakta da olan şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
        }
    },

    'sağ uyluk': {
        label: 'Sağ Uyluk',
        icon: 'directions_walk',
        soru: 'Sağ uyluk şikayeti?',
        seçenekler: {
            'Uyluk ağrısı': {
                soru: 'Ne zaman oluyor?',
                seçenekler: {
                    'Yürüyünce ortaya çıkıyor': null,
                    'Dinlenince geçiyor': null,
                    'Sürekli var': null,
                }
            },
            'Uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Uzun süre oturunca ortaya çıkan uyuşma': null,
                    'Sürekli devam eden uyuşma': null,
                }
            },
            'Şişlik': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Tek bacakta, ağrı ve kızarıklıkla birlikte (pıhtı şüphesi)': null,
                    'Her iki bacakta da olan şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
        }
    },

    'sol diz': {
        label: 'Sol Diz',
        icon: 'directions_walk',
        soru: 'Sol diz şikayeti?',
        seçenekler: {
            'Diz ağrısı': {
                soru: 'Ağrı ne zaman?',
                seçenekler: {
                    'Merdiven inerken / çıkarken': null,
                    'Uzun süre oturduktan sonra': null,
                    'Sürekli ağrıyor': null,
                }
            },
            'Diz şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Travma sonrası oluşan ani şişlik': null,
                    'Yavaşça artan, ısınma ve kızarıklıkla birlikte şişlik': null,
                    'Eforla artan, istirahatte azalan şişlik': null,
                }
            },
            'Diz kilitlenmesi': {
                soru: 'Kilitlenme nasıl?',
                seçenekler: {
                    'Ani bir harekette (dönme/çömelme) kilitlenme': null,
                    'Düzeltmek için elle yardım gereken kilitlenme': null,
                    'Tekrarlayan, sık sık olan kilitlenme': null,
                }
            },
            'Dizde ses / çıtırtı': {
                soru: 'Ses nasıl?',
                seçenekler: {
                    'Ağrı ile birlikte olan çıtırtı': null,
                    'Merdiven inip çıkarken olan çıtırtı': null,
                    'Ağrısız, sadece ses şeklinde olan çıtırtı': null,
                }
            },
        }
    },

    'sağ diz': {
        label: 'Sağ Diz',
        icon: 'directions_walk',
        soru: 'Sağ diz şikayeti?',
        seçenekler: {
            'Diz ağrısı': {
                soru: 'Ağrı ne zaman?',
                seçenekler: {
                    'Merdiven inerken / çıkarken': null,
                    'Uzun süre oturduktan sonra': null,
                    'Sürekli ağrıyor': null,
                }
            },
            'Diz şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Travma sonrası oluşan ani şişlik': null,
                    'Yavaşça artan, ısınma ve kızarıklıkla birlikte şişlik': null,
                    'Eforla artan, istirahatte azalan şişlik': null,
                }
            },
            'Diz kilitlenmesi': {
                soru: 'Kilitlenme nasıl?',
                seçenekler: {
                    'Ani bir harekette (dönme/çömelme) kilitlenme': null,
                    'Düzeltmek için elle yardım gereken kilitlenme': null,
                    'Tekrarlayan, sık sık olan kilitlenme': null,
                }
            },
            'Dizde ses / çıtırtı': {
                soru: 'Ses nasıl?',
                seçenekler: {
                    'Ağrı ile birlikte olan çıtırtı': null,
                    'Merdiven inip çıkarken olan çıtırtı': null,
                    'Ağrısız, sadece ses şeklinde olan çıtırtı': null,
                }
            },
        }
    },

    'sol baldır': {
        label: 'Sol Baldır',
        icon: 'directions_walk',
        soru: 'Sol baldır şikayeti?',
        seçenekler: {
            'Baldır ağrısı': {
                soru: 'Nasıl bir ağrı?',
                seçenekler: {
                    'Yürüyünce oluşuyor, durunca geçiyor': null,
                    'Gece krampı': null,
                    'Sürekli devam ediyor': null,
                    'Şişlik ile birlikte (pıhtı şüphesi)': null,
                }
            },
            'Baldır krampı': {
                soru: 'Kramp nasıl?',
                seçenekler: {
                    'Gece uykuda oluşan kramp': null,
                    'Yürüyüş/egzersiz sonrası oluşan kramp': null,
                    'Sık tekrarlayan, günlerdir devam eden kramp': null,
                }
            },
            'Şişlik / kızarıklık': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Tek bacakta, ağrı ile birlikte (pıhtı şüphesi)': null,
                    'Her iki bacakta da olan şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
        }
    },

    'sağ baldır': {
        label: 'Sağ Baldır',
        icon: 'directions_walk',
        soru: 'Sağ baldır şikayeti?',
        seçenekler: {
            'Baldır ağrısı': {
                soru: 'Nasıl bir ağrı?',
                seçenekler: {
                    'Yürüyünce oluşuyor, durunca geçiyor': null,
                    'Gece krampı': null,
                    'Sürekli devam ediyor': null,
                    'Şişlik ile birlikte (pıhtı şüphesi)': null,
                }
            },
            'Baldır krampı': {
                soru: 'Kramp nasıl?',
                seçenekler: {
                    'Gece uykuda oluşan kramp': null,
                    'Yürüyüş/egzersiz sonrası oluşan kramp': null,
                    'Sık tekrarlayan, günlerdir devam eden kramp': null,
                }
            },
            'Şişlik / kızarıklık': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Tek bacakta, ağrı ile birlikte (pıhtı şüphesi)': null,
                    'Her iki bacakta da olan şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
        }
    },

    'sol ayak': {
        label: 'Sol Ayak',
        icon: 'directions_walk',
        soru: 'Sol ayak şikayeti?',
        seçenekler: {
            'Ayak ağrısı': {
                soru: 'Nerede?',
                seçenekler: {
                    'Topukta (sabah kalkınca kötü)': null,
                    'Ayak tabanında': null,
                    'Parmak eklemlerinde': null,
                }
            },
            'Ayak şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Gün sonunda artan, her iki ayakta da olan şişlik': null,
                    'Tek ayakta, ağrı ve kızarıklıkla birlikte şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
            'Ayakta uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Her iki ayakta da olan, yaygın uyuşma': null,
                    'Uzun süre ayakta kalınca artan uyuşma': null,
                }
            },
        }
    },

    'sağ ayak': {
        label: 'Sağ Ayak',
        icon: 'directions_walk',
        soru: 'Sağ ayak şikayeti?',
        seçenekler: {
            'Ayak ağrısı': {
                soru: 'Nerede?',
                seçenekler: {
                    'Topukta (sabah kalkınca kötü)': null,
                    'Ayak tabanında': null,
                    'Parmak eklemlerinde': null,
                }
            },
            'Ayak şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Gün sonunda artan, her iki ayakta da olan şişlik': null,
                    'Tek ayakta, ağrı ve kızarıklıkla birlikte şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
            'Ayakta uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Her iki ayakta da olan, yaygın uyuşma': null,
                    'Uzun süre ayakta kalınca artan uyuşma': null,
                }
            },
        }
    },

    // ── ARKA GÖRÜNÜM ──────────────────────────

    'kafa arka': {
        label: 'Kafa Arkası',
        icon: 'face',
        soru: 'Kafa arkası şikayeti?',
        seçenekler: {
            'Ense ağrısı': {
                soru: 'Ense ağrısı nasıl?',
                seçenekler: {
                    'Sabah tutulması': null,
                    'Kolları da etkiliyor': null,
                    'Tansiyon ile birlikte': null,
                }
            },
            'Kafa arkasında zonklama': {
                soru: 'Zonklama nasıl?',
                seçenekler: {
                    'Tansiyon yüksekliği şüphesiyle birlikte': null,
                    'Ense sertliğiyle birlikte': null,
                    'Ani ve çok şiddetli başlayan (yıldırım tarzı)': null,
                }
            },
        }
    },

    'boyun arka': {
        label: 'Boyun / Ense',
        icon: 'accessibility_new',
        soru: 'Boyun/ense şikayeti?',
        seçenekler: {
            'Boyun tutulması': {
                soru: 'Tutulma nasıl?',
                seçenekler: {
                    'Sabah kalkınca daha kötü': null,
                    'Ani bir hareketten sonra başladı': null,
                    'Uzun süre bilgisayar/telefon kullanımı sonrası': null,
                }
            },
            'Kola yayılan ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Elde uyuşma ile birlikte': null,
                    'Boyun hareketiyle artan': null,
                    'Güçsüzlükle birlikte': null,
                }
            },
            'Boyun fıtığı şüphesi': {
                soru: 'Hangi belirtiler var?',
                seçenekler: {
                    'Kola/ele yayılan uyuşma': null,
                    'Belirli boyun hareketlerinde elektriklenme hissi': null,
                    'Kolda güç kaybı': null,
                }
            },
        }
    },

    'sol omuz arka': {
        label: 'Sol Kürek',
        icon: 'accessibility_new',
        soru: 'Sol kürek / omuz şikayeti?',
        seçenekler: {
            'Kürek kemiği ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Nefes alırken artan ağrı': null,
                    'Kötü postürle ilişkili, gün içinde artan ağrı': null,
                    'Kola yayılan ağrı': null,
                }
            },
            'Sırt ağrısı sol': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan, kas kökenli ağrı': null,
                    'Nefes alırken artan ağrı': null,
                    'Yanıcı, sinir tarzı ağrı': null,
                }
            },
            'Kol kaldırınca ağrı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Kolu belirli bir açıdan kaldıramama': null,
                    'Gece o tarafa yatamama': null,
                    'Travma sonrası başlayan ağrı': null,
                }
            },
        }
    },

    'sağ omuz arka': {
        label: 'Sağ Kürek',
        icon: 'accessibility_new',
        soru: 'Sağ kürek / omuz şikayeti?',
        seçenekler: {
            'Kürek kemiği ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Nefes alırken artan ağrı': null,
                    'Kötü postürle ilişkili, gün içinde artan ağrı': null,
                    'Kola yayılan ağrı': null,
                }
            },
            'Sırt ağrısı sağ': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan, kas kökenli ağrı': null,
                    'Nefes alırken artan ağrı': null,
                    'Yanıcı, sinir tarzı ağrı': null,
                }
            },
            'Yağlı yemek sonrası sağ sırt ağrısı': {
                soru: 'Eşlik eden belirti var mı?',
                seçenekler: {
                    'Sağ üst karın ağrısıyla birlikte (safra kesesi şüphesi)': null,
                    'Bulantı ile birlikte': null,
                    'Sadece yağlı yemek sonrası, başka zaman olmuyor': null,
                }
            },
        }
    },

    'üst sırt': {
        label: 'Üst Sırt',
        icon: 'accessibility_new',
        soru: 'Üst sırt şikayeti?',
        seçenekler: {
            'Üst sırt ağrısı': {
                soru: 'Ne zaman oluyor?',
                seçenekler: {
                    'Uzun süre oturunca': null,
                    'Öne eğilince': null,
                    'Sürekli var': null,
                }
            },
            'Sırt gerginliği': {
                soru: 'Gerginlik nasıl?',
                seçenekler: {
                    'Uzun süre aynı pozisyonda durunca artan': null,
                    'Stres ile artan': null,
                    'Egzersiz/spor sonrası başlayan': null,
                }
            },
        }
    },

    'bel': {
        label: 'Bel / Alt Sırt',
        icon: 'accessibility_new',
        soru: 'Bel şikayeti?',
        seçenekler: {
            'Bel ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Bacağa yayılan ağrı (siyatik)': null,
                    'Öne eğilince artan': null,
                    'Sabah tutulması': null,
                    'Hareketle geçen, istirahatte kötüleşen': null,
                }
            },
            'Bel tutulması': {
                soru: 'Tutulma nasıl?',
                seçenekler: {
                    'Ağır kaldırdıktan sonra başladı': null,
                    'Ani bir harekette (eğilme/dönme) başladı': null,
                    'Sabah daha kötü, hareketle azalan': null,
                }
            },
            'Bel fıtığı şüphesi': {
                soru: 'Hangi belirtiler var?',
                seçenekler: {
                    'Bacağa yayılan uyuşma/karıncalanma': null,
                    'Bacakta güç kaybı': null,
                    'İdrar/dışkı kontrolünde değişiklik': null,
                }
            },
        }
    },

    'kalça sol': {
        label: 'Sol Kalça',
        icon: 'directions_walk',
        soru: 'Sol kalça şikayeti?',
        seçenekler: {
            'Kalça ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Yürüyünce artan ağrı': null,
                    'Gece yatarken o tarafa yatamama': null,
                    'Travma (düşme) sonrası başlayan ağrı': null,
                }
            },
            'Oturma ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Bacağa yayılan ağrı (siyatik tarzı)': null,
                    'Uzun süre oturunca artan, kalkınca azalan': null,
                    'Sadece oturma sırasında olan, lokal ağrı': null,
                }
            },
            'Yürüyünce topallama': {
                soru: 'Topallama nasıl?',
                seçenekler: {
                    'Ağrıyla birlikte olan topallama': null,
                    'Güçsüzlükten kaynaklanan topallama': null,
                    'Ani başlayan topallama': null,
                }
            },
        }
    },

    'kalça sağ': {
        label: 'Sağ Kalça',
        icon: 'directions_walk',
        soru: 'Sağ kalça şikayeti?',
        seçenekler: {
            'Kalça ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Yürüyünce artan ağrı': null,
                    'Gece yatarken o tarafa yatamama': null,
                    'Travma (düşme) sonrası başlayan ağrı': null,
                }
            },
            'Oturma ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Bacağa yayılan ağrı (siyatik tarzı)': null,
                    'Uzun süre oturunca artan, kalkınca azalan': null,
                    'Sadece oturma sırasında olan, lokal ağrı': null,
                }
            },
            'Yürüyünce topallama': {
                soru: 'Topallama nasıl?',
                seçenekler: {
                    'Ağrıyla birlikte olan topallama': null,
                    'Güçsüzlükten kaynaklanan topallama': null,
                    'Ani başlayan topallama': null,
                }
            },
        }
    },

    'sol kol arka': {
        label: 'Sol Kol',
        icon: 'back_hand',
        soru: 'Sol kol şikayeti?',
        seçenekler: {
            'Sol kol ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan ağrı': null,
                    'İstirahatte de devam eden': null,
                    'Göğüsten yayılan ağrı': null,
                }
            },
            'Sol kolda uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Boyun hareketiyle artan uyuşma': null,
                    'Elin belirli parmaklarında uyuşma': null,
                    'Göğüs ağrısıyla birlikte ani başlayan uyuşma': null,
                }
            },
            'Sol kolda güçsüzlük': {
                soru: 'Güçsüzlük nasıl?',
                seçenekler: {
                    'Ani başlayan, yüzde de güçsüzlükle birlikte': null,
                    'Belirli bir harekette ortaya çıkan güçsüzlük': null,
                    'Yavaşça artan, günlerdir devam eden güçsüzlük': null,
                }
            },
            'Sol kolda şişlik': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Travma sonrası oluşan şişlik': null,
                    'Kızarıklık ve ısı artışıyla birlikte': null,
                    'Yavaşça büyüyen, ağrısız şişlik': null,
                }
            },
        }
    },

    'sağ kol arka': {
        label: 'Sağ Kol',
        icon: 'back_hand',
        soru: 'Sağ kol şikayeti?',
        seçenekler: {
            'Sağ kol ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Hareketle artan ağrı': null,
                    'İstirahatte de devam eden': null,
                    'Göğüsten yayılan ağrı': null,
                }
            },
            'Sağ kolda uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Boyun hareketiyle artan uyuşma': null,
                    'Elin belirli parmaklarında uyuşma': null,
                    'Göğüs ağrısıyla birlikte ani başlayan uyuşma': null,
                }
            },
            'Sağ kolda güçsüzlük': {
                soru: 'Güçsüzlük nasıl?',
                seçenekler: {
                    'Ani başlayan, yüzde de güçsüzlükle birlikte': null,
                    'Belirli bir harekette ortaya çıkan güçsüzlük': null,
                    'Yavaşça artan, günlerdir devam eden güçsüzlük': null,
                }
            },
            'Sağ kolda şişlik': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Travma sonrası oluşan şişlik': null,
                    'Kızarıklık ve ısı artışıyla birlikte': null,
                    'Yavaşça büyüyen, ağrısız şişlik': null,
                }
            },
        }
    },

    'sol el arka': {
        label: 'Sol El',
        icon: 'back_hand',
        soru: 'Sol el şikayeti?',
        seçenekler: {
            'Sol el ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Eklemlerde sabah sertliğiyle birlikte ağrı': null,
                    'Travma sonrası başlayan ağrı': null,
                    'Tekrarlayan hareketlerle artan ağrı': null,
                }
            },
            'Sol el uyuşması': {
                soru: 'Uyuşma ne zaman?',
                seçenekler: {
                    'Gece uyurken uyuşuyor': null,
                    'Sürekli uyuşuyor': null,
                    'Belirli pozisyonda uyuşuyor': null,
                }
            },
            'Sol el titremesi': {
                soru: 'Titreme nasıl?',
                seçenekler: {
                    'İstirahatte ortaya çıkan titreme': null,
                    'Bir şey tutmaya çalışırken artan titreme': null,
                    'Stres veya heyecanla artan titreme': null,
                }
            },
            'Sol bilek ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Travma sonrası şişlikle birlikte ağrı': null,
                    'Tekrarlayan hareketlerle artan ağrı': null,
                    'Sabah sertliğiyle birlikte ağrı': null,
                }
            },
        }
    },

    'sağ el arka': {
        label: 'Sağ El',
        icon: 'back_hand',
        soru: 'Sağ el şikayeti?',
        seçenekler: {
            'Sağ el ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Eklemlerde sabah sertliğiyle birlikte ağrı': null,
                    'Travma sonrası başlayan ağrı': null,
                    'Tekrarlayan hareketlerle artan ağrı': null,
                }
            },
            'Sağ el uyuşması': {
                soru: 'Uyuşma ne zaman?',
                seçenekler: {
                    'Gece uyurken uyuşuyor': null,
                    'Sürekli uyuşuyor': null,
                    'Belirli pozisyonda uyuşuyor': null,
                }
            },
            'Sağ el titremesi': {
                soru: 'Titreme nasıl?',
                seçenekler: {
                    'İstirahatte ortaya çıkan titreme': null,
                    'Bir şey tutmaya çalışırken artan titreme': null,
                    'Stres veya heyecanla artan titreme': null,
                }
            },
            'Sağ bilek ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Travma sonrası şişlikle birlikte ağrı': null,
                    'Tekrarlayan hareketlerle artan ağrı': null,
                    'Sabah sertliğiyle birlikte ağrı': null,
                }
            },
        }
    },

    'sol bacak arka': {
        label: 'Sol Bacak Arkası',
        icon: 'directions_walk',
        soru: 'Sol bacak arkası şikayeti?',
        seçenekler: {
            'Sol bacak arkası ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Yürüyünce artan ağrı': null,
                    'Siyatik tarzı yayılan ağrı': null,
                    'Kas gerginliği': null,
                }
            },
            'Sol baldır krampı': {
                soru: 'Kramp nasıl?',
                seçenekler: {
                    'Gece uykuda oluşan kramp': null,
                    'Yürüyüş/egzersiz sonrası oluşan kramp': null,
                    'Sık tekrarlayan, günlerdir devam eden kramp': null,
                }
            },
            'Sol bacakta uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Uzun süre oturunca ortaya çıkan uyuşma': null,
                    'Sürekli devam eden uyuşma': null,
                }
            },
        }
    },

    'sağ bacak arka': {
        label: 'Sağ Bacak Arkası',
        icon: 'directions_walk',
        soru: 'Sağ bacak arkası şikayeti?',
        seçenekler: {
            'Sağ bacak arkası ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Yürüyünce artan ağrı': null,
                    'Siyatik tarzı yayılan ağrı': null,
                    'Kas gerginliği': null,
                }
            },
            'Sağ baldır krampı': {
                soru: 'Kramp nasıl?',
                seçenekler: {
                    'Gece uykuda oluşan kramp': null,
                    'Yürüyüş/egzersiz sonrası oluşan kramp': null,
                    'Sık tekrarlayan, günlerdir devam eden kramp': null,
                }
            },
            'Sağ bacakta uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Uzun süre oturunca ortaya çıkan uyuşma': null,
                    'Sürekli devam eden uyuşma': null,
                }
            },
        }
    },

    'sol ayak arka': {
        label: 'Sol Ayak',
        icon: 'directions_walk',
        soru: 'Sol ayak şikayeti?',
        seçenekler: {
            'Sol topuk ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Sabah ilk adımlarda en kötü (topuk dikeni şüphesi)': null,
                    'Uzun süre ayakta kalınca artan': null,
                    'Spor/koşu sonrası başlayan': null,
                }
            },
            'Sol ayak tabanı ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Sabah ilk adımlarda artan': null,
                    'Uzun süre yürüyünce artan': null,
                    'Yanma / batma tarzı ağrı': null,
                }
            },
            'Sol ayakta uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Her iki ayakta da olan, yaygın uyuşma': null,
                    'Uzun süre ayakta kalınca artan uyuşma': null,
                }
            },
            'Sol ayak şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Gün sonunda artan, her iki ayakta da olan şişlik': null,
                    'Tek ayakta, ağrı ve kızarıklıkla birlikte şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
        }
    },

    'sağ ayak arka': {
        label: 'Sağ Ayak',
        icon: 'directions_walk',
        soru: 'Sağ ayak şikayeti?',
        seçenekler: {
            'Sağ topuk ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Sabah ilk adımlarda en kötü (topuk dikeni şüphesi)': null,
                    'Uzun süre ayakta kalınca artan': null,
                    'Spor/koşu sonrası başlayan': null,
                }
            },
            'Sağ ayak tabanı ağrısı': {
                soru: 'Ağrı nasıl?',
                seçenekler: {
                    'Sabah ilk adımlarda artan': null,
                    'Uzun süre yürüyünce artan': null,
                    'Yanma / batma tarzı ağrı': null,
                }
            },
            'Sağ ayakta uyuşma': {
                soru: 'Uyuşma nasıl?',
                seçenekler: {
                    'Belden yayılan uyuşma': null,
                    'Her iki ayakta da olan, yaygın uyuşma': null,
                    'Uzun süre ayakta kalınca artan uyuşma': null,
                }
            },
            'Sağ ayak şişliği': {
                soru: 'Şişlik nasıl?',
                seçenekler: {
                    'Gün sonunda artan, her iki ayakta da olan şişlik': null,
                    'Tek ayakta, ağrı ve kızarıklıkla birlikte şişlik': null,
                    'Travma sonrası oluşan şişlik': null,
                }
            },
        }
    },
};

// ============================================
// İNGİLİZCE AĞAÇ (DRILL_DOWN_EN)
// Bölge anahtarları (data-region ile eşleşmesi için, örn. 'baş') HER
// İKİ AĞAÇTA DA AYNI kalır — sadece etiket/soru/seçenek METİNLERİ
// dile göre değişir. Tüm bölgeler (Ön + Arka görünüm, 39 bölge)
// tam İngilizce'ye çevrildi, her yaprağa 3 detay sorusu eklendi.
// ============================================
const DRILL_DOWN_EN = {
    ...DRILL_DOWN_TR,

    'baş': {
        label: 'Head',
        icon: 'face',
        soru: 'What is the complaint in the head area?',
        seçenekler: {
            'Headache': {
                soru: 'How does the pain feel?',
                seçenekler: {
                    'Throbbing headache': null,
                    'Band-like, tight headache': null,
                    'One-sided headache': null,
                    'Headache right after waking up': null,
                    'Headache that worsens with coughing': null,
                }
            },
            'Dizziness': {
                soru: 'What kind of dizziness?',
                seçenekler: {
                    'Spinning sensation (vertigo)': null,
                    'Lightheadedness, unsteadiness': null,
                    'Dizziness when standing up': null,
                }
            },
            'Vision problems': {
                soru: 'What kind of vision problem?',
                seçenekler: {
                    'Blurred vision': null,
                    'Double vision': null,
                    'Sensitivity to light': null,
                    'Dark spots / loss in field of vision': null,
                }
            },
            'Facial pain / swelling': {
                soru: 'How is your facial complaint?',
                seçenekler: {
                    'Sudden numbness or drooping on one side of the face': null,
                    'Sinus pressure, worse when bending forward': null,
                    'Swelling and tenderness near a tooth root': null,
                }
            },
            'Ear pain': {
                soru: 'How is the ear pain?',
                seçenekler: {
                    'Accompanied by ear discharge or hearing loss': null,
                    'Worse with jaw movement': null,
                    'Started after swimming': null,
                }
            },
            'Ringing in the ear': {
                soru: 'How is the ringing?',
                seçenekler: {
                    'Started together with sudden hearing loss': null,
                    'Constant, lasting for days/weeks': null,
                    'Accompanied by dizziness': null,
                }
            },
        }
    },

    'boyun': {
        label: 'Neck',
        icon: 'accessibility_new',
        soru: 'What is the complaint in your neck?',
        seçenekler: {
            'Neck pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Morning stiffness, pain with movement': null,
                    'Pain radiating to arm or shoulder': null,
                    'Constant, all-day pain': null,
                }
            },
            'Sore throat': {
                soru: 'What is the throat complaint?',
                seçenekler: {
                    'Pain when swallowing': null,
                    'Feeling of a lump in the throat': null,
                    'Hoarseness': null,
                }
            },
            'Swelling / lump in the neck': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'With fever and sore throat (swollen lymph node)': null,
                    'Painless, firm, growing lump': null,
                    'Rapidly growing, red and tender swelling': null,
                }
            },
            'Difficulty swallowing': {
                soru: 'How is the difficulty?',
                seçenekler: {
                    'Started suddenly, with a choking sensation': null,
                    'Feeling of food getting stuck when swallowing': null,
                    'Started after exposure to something allergenic (food/medication)': null,
                }
            },
        }
    },

    'göğüs': {
        label: 'Chest',
        icon: 'favorite',
        soru: 'What is the complaint in your chest?',
        seçenekler: {
            'Chest pain': {
                soru: 'How does the pain feel?',
                seçenekler: {
                    'Pressure, tightness sensation': null,
                    'Burning, fire-like': null,
                    'Sharp, stabbing pain': null,
                    'Radiating to arm or jaw': null,
                    'Decreases when leaning forward': null,
                }
            },
            'Shortness of breath': {
                soru: 'When does the shortness of breath occur?',
                seçenekler: {
                    'With exertion (walking, climbing stairs)': null,
                    'Present at rest too': null,
                    'Worse when lying down': null,
                    'Started suddenly': null,
                }
            },
            'Palpitations': {
                soru: 'How do the palpitations feel?',
                seçenekler: {
                    'Fast but regular': null,
                    'Irregular, skipping sensation': null,
                    'Starts and stops suddenly': null,
                }
            },
            'Cough': {
                soru: 'How is the cough?',
                seçenekler: {
                    'Dry cough': null,
                    'Cough with phlegm': null,
                    'Bloody phlegm': null,
                    'Worse at night': null,
                }
            },
        }
    },

    'karın üst': {
        label: 'Upper Abdomen',
        icon: 'airline_seat_flat',
        soru: 'What is the complaint in your upper abdomen?',
        seçenekler: {
            'Stomach pain': {
                soru: 'When does it occur?',
                seçenekler: {
                    'Worse on an empty stomach': null,
                    'Worse after eating': null,
                    'After fatty meals': null,
                    'Constantly present': null,
                }
            },
            'Heartburn / reflux': {
                soru: 'How is your reflux complaint?',
                seçenekler: {
                    'Worse when lying down / bending over': null,
                    'Sour fluid coming up to the mouth': null,
                    'Burning sensation when swallowing': null,
                }
            },
            'Nausea': {
                soru: 'Is the nausea on its own?',
                seçenekler: {
                    'Only nausea': null,
                    'With vomiting': null,
                    'With dizziness': null,
                }
            },
            'Bloating / gas': {
                soru: 'How is the bloating?',
                seçenekler: {
                    'Worse after meals': null,
                    'Relieved by bowel movement': null,
                    'Feeling of hardness and tightness in the abdomen': null,
                }
            },
            'Jaundice (yellowing of skin/eyes)': {
                soru: 'What accompanies the jaundice?',
                seçenekler: {
                    'Dark-colored urine': null,
                    'Pale (whitish) stool': null,
                    'Pain in the upper right abdomen': null,
                }
            },
        }
    },

    'karın alt': {
        label: 'Lower Abdomen',
        icon: 'airline_seat_flat',
        soru: 'What is the complaint in your lower abdomen?',
        seçenekler: {
            'Abdominal pain': {
                soru: 'Where is the pain?',
                seçenekler: {
                    'Right lower abdomen (appendix area)': null,
                    'Left lower abdomen': null,
                    'Entire lower abdomen': null,
                    'Cramping, comes and goes': null,
                }
            },
            'Diarrhea': {
                soru: 'How is the diarrhea?',
                seçenekler: {
                    'Watery, frequent bowel movements': null,
                    'Bloody diarrhea': null,
                    'Mucousy stool': null,
                }
            },
            'Constipation': {
                soru: 'How long has the constipation lasted?',
                seçenekler: {
                    'A few days, with abdominal bloating': null,
                    'Chronic, long-standing constipation': null,
                    'With blood in stool or severe abdominal pain': null,
                }
            },
            'Urinary complaint': {
                soru: 'What is the urinary complaint?',
                seçenekler: {
                    'Burning when urinating': null,
                    'Frequent urination': null,
                    'Blood in urine': null,
                    'Unable to urinate': null,
                }
            },
        }
    },

    'kasık sol': {
        label: 'Left Groin',
        icon: 'airline_seat_flat',
        soru: 'What is your left groin complaint?',
        seçenekler: {
            'Left groin pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when standing, with a swelling that disappears when lying down (possible hernia)': null,
                    'Sudden onset, very severe pain': null,
                    'Worse with movement, tightness in the groin area': null,
                }
            },
            'Swelling in left groin': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Grows when standing, disappears when lying down': null,
                    'Fixed, small, non-growing swelling': null,
                    'Painful, red and tender swelling': null,
                }
            },
            'Pain when urinating': {
                soru: 'How is the pain?',
                seçenekler: {
                    'With a burning sensation': null,
                    'With frequent urination': null,
                    'With blood in urine': null,
                }
            },
        }
    },

    'kasık sağ': {
        label: 'Right Groin',
        icon: 'airline_seat_flat',
        soru: 'What is your right groin complaint?',
        seçenekler: {
            'Right groin pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when standing, with a swelling that disappears when lying down (possible hernia)': null,
                    'Sudden onset, very severe pain': null,
                    'Worse with movement, tightness in the groin area': null,
                }
            },
            'Swelling in right groin': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Grows when standing, disappears when lying down': null,
                    'Fixed, small, non-growing swelling': null,
                    'Painful, red and tender swelling': null,
                }
            },
            'Pain in the appendix area': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Starts around the navel and moves to the right lower abdomen': null,
                    'Worse with coughing or pressure': null,
                    'With fever and loss of appetite': null,
                }
            },
        }
    },

    'sol omuz': {
        label: 'Left Shoulder',
        icon: 'accessibility_new',
        soru: 'What is your left shoulder complaint?',
        seçenekler: {
            'Left shoulder pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with movement': null,
                    'Persists at rest too': null,
                    'Pain radiating to the arm': null,
                }
            },
            'Left shoulder stiffness': {
                soru: 'How is the stiffness?',
                seçenekler: {
                    'Worse in the morning, improves during the day': null,
                    'Unable to lift the arm at a certain angle': null,
                    'Started after trauma (impact/fall)': null,
                }
            },
            'Pain when raising left arm': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain at a specific point when raising the arm sideways': null,
                    'Unable to raise the arm overhead': null,
                    'Unable to lie on that side at night': null,
                }
            },
            'Left shoulder swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Swelling after trauma': null,
                    'With redness and warmth': null,
                    'Slowly growing, painless swelling': null,
                }
            },
        }
    },

    'sağ omuz': {
        label: 'Right Shoulder',
        icon: 'accessibility_new',
        soru: 'What is your right shoulder complaint?',
        seçenekler: {
            'Right shoulder pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with movement': null,
                    'Persists at rest too': null,
                    'Pain radiating to the arm': null,
                }
            },
            'Right shoulder stiffness': {
                soru: 'How is the stiffness?',
                seçenekler: {
                    'Worse in the morning, improves during the day': null,
                    'Unable to lift the arm at a certain angle': null,
                    'Started after trauma (impact/fall)': null,
                }
            },
            'Pain when raising right arm': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain at a specific point when raising the arm sideways': null,
                    'Unable to raise the arm overhead': null,
                    'Unable to lie on that side at night': null,
                }
            },
            'Right shoulder swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Swelling after trauma': null,
                    'With redness and warmth': null,
                    'Slowly growing, painless swelling': null,
                }
            },
        }
    },

    'sol kol üst': {
        label: 'Left Upper Arm',
        icon: 'back_hand',
        soru: 'What is your left arm complaint?',
        seçenekler: {
            'Pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with movement': null,
                    'Persists at rest too': null,
                    'Pain radiating from the chest': null,
                }
            },
            'Weakness': {
                soru: 'How is the weakness?',
                seçenekler: {
                    'Sudden onset, with weakness in the face too': null,
                    'Weakness that appears with a specific movement': null,
                    'Slowly increasing, lasting for days': null,
                }
            },
            'Numbness / tingling': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Worse with neck movement': null,
                    'Numbness in specific fingers': null,
                    'Sudden numbness together with chest pain': null,
                }
            },
        }
    },

    'sol ön kol': {
        label: 'Left Forearm',
        icon: 'back_hand',
        soru: 'What is your left forearm complaint?',
        seçenekler: {
            'Forearm pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with repetitive hand/wrist movements': null,
                    'Pain that started after trauma (impact/fall)': null,
                    'Pain radiating from the chest to the arm': null,
                }
            },
            'Numbness / tingling': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Worse at night': null,
                    'Constant numbness': null,
                    'Worse with neck movement': null,
                }
            },
            'Muscle cramp': {
                soru: 'How is the cramp?',
                seçenekler: {
                    'Cramp after exercise': null,
                    'Cramp during sleep at night': null,
                    'Frequently recurring, lasting for days': null,
                }
            },
        }
    },

    'sol el': {
        label: 'Left Hand / Wrist',
        icon: 'back_hand',
        soru: 'What is your left hand / wrist complaint?',
        seçenekler: {
            'Hand pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with morning joint stiffness': null,
                    'Pain that started after trauma (impact/fall)': null,
                    'Pain that worsens with repetitive movements (writing, typing, etc.)': null,
                }
            },
            'Wrist pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with swelling after trauma': null,
                    'Pain that worsens with repetitive movements': null,
                    'Pain with morning stiffness': null,
                }
            },
            'Hand numbness': {
                soru: 'When does the numbness occur?',
                seçenekler: {
                    'Numb while sleeping at night': null,
                    'Constantly numb': null,
                    'Numb in a certain position': null,
                }
            },
            'Hand tremor': {
                soru: 'How is the tremor?',
                seçenekler: {
                    'Tremor at rest': null,
                    'Tremor that increases when trying to hold something': null,
                    'Tremor that increases with stress or excitement': null,
                }
            },
        }
    },

    'sağ kol üst': {
        label: 'Right Upper Arm',
        icon: 'back_hand',
        soru: 'What is your right arm complaint?',
        seçenekler: {
            'Pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with movement': null,
                    'Persists at rest too': null,
                    'Pain radiating from the neck or back': null,
                }
            },
            'Weakness': {
                soru: 'How is the weakness?',
                seçenekler: {
                    'Sudden onset, with weakness in the face too': null,
                    'Weakness that appears with a specific movement': null,
                    'Slowly increasing, lasting for days': null,
                }
            },
            'Numbness / tingling': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Worse with neck movement': null,
                    'Numbness in specific fingers': null,
                    'Sudden numbness together with chest pain': null,
                }
            },
        }
    },

    'sağ ön kol': {
        label: 'Right Forearm',
        icon: 'back_hand',
        soru: 'What is your right forearm complaint?',
        seçenekler: {
            'Forearm pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with repetitive hand/wrist movements': null,
                    'Pain that started after trauma (impact/fall)': null,
                    'Pain radiating from the chest to the arm': null,
                }
            },
            'Numbness / tingling': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Worse at night': null,
                    'Constant numbness': null,
                    'Worse with neck movement': null,
                }
            },
            'Muscle cramp': {
                soru: 'How is the cramp?',
                seçenekler: {
                    'Cramp after exercise': null,
                    'Cramp during sleep at night': null,
                    'Frequently recurring, lasting for days': null,
                }
            },
        }
    },

    'sağ el': {
        label: 'Right Hand / Wrist',
        icon: 'back_hand',
        soru: 'What is your right hand / wrist complaint?',
        seçenekler: {
            'Hand pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with morning joint stiffness': null,
                    'Pain that started after trauma (impact/fall)': null,
                    'Pain that worsens with repetitive movements (writing, typing, etc.)': null,
                }
            },
            'Wrist pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with swelling after trauma': null,
                    'Pain that worsens with repetitive movements': null,
                    'Pain with morning stiffness': null,
                }
            },
            'Hand numbness': {
                soru: 'When does the numbness occur?',
                seçenekler: {
                    'Numb while sleeping at night': null,
                    'Constantly numb': null,
                    'Numb in a certain position': null,
                }
            },
            'Hand tremor': {
                soru: 'How is the tremor?',
                seçenekler: {
                    'Tremor at rest': null,
                    'Tremor that increases when trying to hold something': null,
                    'Tremor that increases with stress or excitement': null,
                }
            },
        }
    },

    'sol uyluk': {
        label: 'Left Thigh',
        icon: 'directions_walk',
        soru: 'What is your left thigh complaint?',
        seçenekler: {
            'Thigh pain': {
                soru: 'When does it occur?',
                seçenekler: {
                    'Appears when walking': null,
                    'Relieved by resting': null,
                    'Constantly present': null,
                }
            },
            'Numbness': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Appears after sitting for a long time': null,
                    'Constant numbness': null,
                }
            },
            'Swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'In one leg only, with pain and redness (possible blood clot)': null,
                    'Swelling in both legs': null,
                    'Swelling after trauma': null,
                }
            },
        }
    },

    'sağ uyluk': {
        label: 'Right Thigh',
        icon: 'directions_walk',
        soru: 'What is your right thigh complaint?',
        seçenekler: {
            'Thigh pain': {
                soru: 'When does it occur?',
                seçenekler: {
                    'Appears when walking': null,
                    'Relieved by resting': null,
                    'Constantly present': null,
                }
            },
            'Numbness': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Appears after sitting for a long time': null,
                    'Constant numbness': null,
                }
            },
            'Swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'In one leg only, with pain and redness (possible blood clot)': null,
                    'Swelling in both legs': null,
                    'Swelling after trauma': null,
                }
            },
        }
    },

    'sol diz': {
        label: 'Left Knee',
        icon: 'directions_walk',
        soru: 'What is your left knee complaint?',
        seçenekler: {
            'Knee pain': {
                soru: 'When is the pain?',
                seçenekler: {
                    'Going up/down stairs': null,
                    'After sitting for a long time': null,
                    'Constant pain': null,
                }
            },
            'Knee swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Sudden swelling after trauma': null,
                    'Gradually increasing swelling with warmth and redness': null,
                    'Worse with exertion, decreases with rest': null,
                }
            },
            'Knee locking': {
                soru: 'How is the locking?',
                seçenekler: {
                    'Locks with a sudden movement (turning/squatting)': null,
                    'Locking that needs manual help to fix': null,
                    'Frequently recurring locking': null,
                }
            },
            'Clicking / popping in the knee': {
                soru: 'How is the sound?',
                seçenekler: {
                    'Popping with pain': null,
                    'Popping when going up/down stairs': null,
                    'Painless, just a sound': null,
                }
            },
        }
    },

    'sağ diz': {
        label: 'Right Knee',
        icon: 'directions_walk',
        soru: 'What is your right knee complaint?',
        seçenekler: {
            'Knee pain': {
                soru: 'When is the pain?',
                seçenekler: {
                    'Going up/down stairs': null,
                    'After sitting for a long time': null,
                    'Constant pain': null,
                }
            },
            'Knee swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Sudden swelling after trauma': null,
                    'Gradually increasing swelling with warmth and redness': null,
                    'Worse with exertion, decreases with rest': null,
                }
            },
            'Knee locking': {
                soru: 'How is the locking?',
                seçenekler: {
                    'Locks with a sudden movement (turning/squatting)': null,
                    'Locking that needs manual help to fix': null,
                    'Frequently recurring locking': null,
                }
            },
            'Clicking / popping in the knee': {
                soru: 'How is the sound?',
                seçenekler: {
                    'Popping with pain': null,
                    'Popping when going up/down stairs': null,
                    'Painless, just a sound': null,
                }
            },
        }
    },

    'sol baldır': {
        label: 'Left Calf',
        icon: 'directions_walk',
        soru: 'What is your left calf complaint?',
        seçenekler: {
            'Calf pain': {
                soru: 'What kind of pain?',
                seçenekler: {
                    'Occurs with walking, relieved by stopping': null,
                    'Night cramps': null,
                    'Constantly present': null,
                    'With swelling (possible blood clot)': null,
                }
            },
            'Calf cramp': {
                soru: 'How is the cramp?',
                seçenekler: {
                    'Cramp during sleep at night': null,
                    'Cramp after walking/exercise': null,
                    'Frequently recurring, lasting for days': null,
                }
            },
            'Swelling / redness': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'In one leg only, with pain (possible blood clot)': null,
                    'Swelling in both legs': null,
                    'Swelling after trauma': null,
                }
            },
        }
    },

    'sağ baldır': {
        label: 'Right Calf',
        icon: 'directions_walk',
        soru: 'What is your right calf complaint?',
        seçenekler: {
            'Calf pain': {
                soru: 'What kind of pain?',
                seçenekler: {
                    'Occurs with walking, relieved by stopping': null,
                    'Night cramps': null,
                    'Constantly present': null,
                    'With swelling (possible blood clot)': null,
                }
            },
            'Calf cramp': {
                soru: 'How is the cramp?',
                seçenekler: {
                    'Cramp during sleep at night': null,
                    'Cramp after walking/exercise': null,
                    'Frequently recurring, lasting for days': null,
                }
            },
            'Swelling / redness': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'In one leg only, with pain (possible blood clot)': null,
                    'Swelling in both legs': null,
                    'Swelling after trauma': null,
                }
            },
        }
    },

    'sol ayak': {
        label: 'Left Foot',
        icon: 'directions_walk',
        soru: 'What is your left foot complaint?',
        seçenekler: {
            'Foot pain': {
                soru: 'Where?',
                seçenekler: {
                    'In the heel (worse on getting up in the morning)': null,
                    'In the sole of the foot': null,
                    'In the toe joints': null,
                }
            },
            'Foot swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Worse by end of day, in both feet': null,
                    'In one foot only, with pain and redness': null,
                    'Swelling after trauma': null,
                }
            },
            'Foot numbness': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Widespread numbness in both feet': null,
                    'Worse after standing for a long time': null,
                }
            },
        }
    },

    'sağ ayak': {
        label: 'Right Foot',
        icon: 'directions_walk',
        soru: 'What is your right foot complaint?',
        seçenekler: {
            'Foot pain': {
                soru: 'Where?',
                seçenekler: {
                    'In the heel (worse on getting up in the morning)': null,
                    'In the sole of the foot': null,
                    'In the toe joints': null,
                }
            },
            'Foot swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Worse by end of day, in both feet': null,
                    'In one foot only, with pain and redness': null,
                    'Swelling after trauma': null,
                }
            },
            'Foot numbness': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Widespread numbness in both feet': null,
                    'Worse after standing for a long time': null,
                }
            },
        }
    },
    // ── BACK VIEW (English) ────────────────────

    'kafa arka': {
        label: 'Back of Head',
        icon: 'face',
        soru: 'What is the complaint at the back of your head?',
        seçenekler: {
            'Pain at the base of the skull / nape': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Morning stiffness': null,
                    'Also affects the arms': null,
                    'Together with high blood pressure': null,
                }
            },
            'Throbbing at the back of the head': {
                soru: 'How is the throbbing?',
                seçenekler: {
                    'With suspected high blood pressure': null,
                    'With neck stiffness': null,
                    'Sudden and very severe onset (thunderclap-like)': null,
                }
            },
        }
    },

    'boyun arka': {
        label: 'Neck / Nape',
        icon: 'accessibility_new',
        soru: 'What is your neck / nape complaint?',
        seçenekler: {
            'Neck stiffness': {
                soru: 'How is the stiffness?',
                seçenekler: {
                    'Worse upon waking in the morning': null,
                    'Started after a sudden movement': null,
                    'After long computer/phone use': null,
                }
            },
            'Pain radiating to the arm': {
                soru: 'How is the pain?',
                seçenekler: {
                    'With numbness in the hand': null,
                    'Worse with neck movement': null,
                    'With weakness': null,
                }
            },
            'Suspected herniated neck disc': {
                soru: 'Which symptoms are present?',
                seçenekler: {
                    'Numbness radiating to the arm/hand': null,
                    'Electric-shock sensation with certain neck movements': null,
                    'Loss of strength in the arm': null,
                }
            },
        }
    },

    'sol omuz arka': {
        label: 'Left Shoulder Blade',
        icon: 'accessibility_new',
        soru: 'What is your left shoulder blade / shoulder complaint?',
        seçenekler: {
            'Shoulder blade pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when breathing': null,
                    'Related to poor posture, worse throughout the day': null,
                    'Pain radiating to the arm': null,
                }
            },
            'Left back pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse with movement, muscular in origin': null,
                    'Worse when breathing': null,
                    'Burning, nerve-like pain': null,
                }
            },
            'Pain when raising the arm': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Unable to raise the arm at a certain angle': null,
                    'Unable to lie on that side at night': null,
                    'Started after trauma': null,
                }
            },
        }
    },

    'sağ omuz arka': {
        label: 'Right Shoulder Blade',
        icon: 'accessibility_new',
        soru: 'What is your right shoulder blade / shoulder complaint?',
        seçenekler: {
            'Shoulder blade pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when breathing': null,
                    'Related to poor posture, worse throughout the day': null,
                    'Pain radiating to the arm': null,
                }
            },
            'Right back pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse with movement, muscular in origin': null,
                    'Worse when breathing': null,
                    'Burning, nerve-like pain': null,
                }
            },
            'Right-sided back pain after fatty meals': {
                soru: 'Is there any accompanying symptom?',
                seçenekler: {
                    'With pain in the upper right abdomen (suspected gallbladder)': null,
                    'With nausea': null,
                    'Only after fatty meals, not at other times': null,
                }
            },
        }
    },

    'üst sırt': {
        label: 'Upper Back',
        icon: 'accessibility_new',
        soru: 'What is your upper back complaint?',
        seçenekler: {
            'Upper back pain': {
                soru: 'When does it occur?',
                seçenekler: {
                    'After sitting for a long time': null,
                    'When bending forward': null,
                    'Constantly present': null,
                }
            },
            'Back tightness': {
                soru: 'How is the tightness?',
                seçenekler: {
                    'Worse after staying in the same position for a long time': null,
                    'Worse with stress': null,
                    'Started after exercise/sports': null,
                }
            },
        }
    },

    'bel': {
        label: 'Lower Back',
        icon: 'accessibility_new',
        soru: 'What is your lower back complaint?',
        seçenekler: {
            'Lower back pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain radiating to the leg (sciatica)': null,
                    'Worse when bending forward': null,
                    'Morning stiffness': null,
                    'Relieved by movement, worse at rest': null,
                }
            },
            'Lower back spasm / lock': {
                soru: 'How did it start?',
                seçenekler: {
                    'Started after lifting something heavy': null,
                    'Started with a sudden movement (bending/twisting)': null,
                    'Worse in the morning, improves with movement': null,
                }
            },
            'Suspected herniated lower back disc': {
                soru: 'Which symptoms are present?',
                seçenekler: {
                    'Numbness/tingling radiating to the leg': null,
                    'Loss of strength in the leg': null,
                    'Change in bladder/bowel control': null,
                }
            },
        }
    },

    'kalça sol': {
        label: 'Left Hip',
        icon: 'directions_walk',
        soru: 'What is your left hip complaint?',
        seçenekler: {
            'Hip pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when walking': null,
                    'Unable to lie on that side at night': null,
                    'Started after trauma (a fall)': null,
                }
            },
            'Pain when sitting': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain radiating to the leg (sciatica-like)': null,
                    'Worse after sitting for a long time, eases on standing': null,
                    'Localized pain only while sitting': null,
                }
            },
            'Limping when walking': {
                soru: 'How is the limping?',
                seçenekler: {
                    'Limping accompanied by pain': null,
                    'Limping caused by weakness': null,
                    'Sudden onset limping': null,
                }
            },
        }
    },

    'kalça sağ': {
        label: 'Right Hip',
        icon: 'directions_walk',
        soru: 'What is your right hip complaint?',
        seçenekler: {
            'Hip pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when walking': null,
                    'Unable to lie on that side at night': null,
                    'Started after trauma (a fall)': null,
                }
            },
            'Pain when sitting': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain radiating to the leg (sciatica-like)': null,
                    'Worse after sitting for a long time, eases on standing': null,
                    'Localized pain only while sitting': null,
                }
            },
            'Limping when walking': {
                soru: 'How is the limping?',
                seçenekler: {
                    'Limping accompanied by pain': null,
                    'Limping caused by weakness': null,
                    'Sudden onset limping': null,
                }
            },
        }
    },

    'sol kol arka': {
        label: 'Left Arm',
        icon: 'back_hand',
        soru: 'What is your left arm complaint?',
        seçenekler: {
            'Left arm pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with movement': null,
                    'Persists at rest too': null,
                    'Pain radiating from the chest': null,
                }
            },
            'Numbness in left arm': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Worse with neck movement': null,
                    'Numbness in specific fingers': null,
                    'Sudden numbness together with chest pain': null,
                }
            },
            'Weakness in left arm': {
                soru: 'How is the weakness?',
                seçenekler: {
                    'Sudden onset, with weakness in the face too': null,
                    'Weakness that appears with a specific movement': null,
                    'Slowly increasing, lasting for days': null,
                }
            },
            'Swelling in left arm': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Swelling after trauma': null,
                    'With redness and warmth': null,
                    'Slowly growing, painless swelling': null,
                }
            },
        }
    },

    'sağ kol arka': {
        label: 'Right Arm',
        icon: 'back_hand',
        soru: 'What is your right arm complaint?',
        seçenekler: {
            'Right arm pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain that increases with movement': null,
                    'Persists at rest too': null,
                    'Pain radiating from the chest': null,
                }
            },
            'Numbness in right arm': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Worse with neck movement': null,
                    'Numbness in specific fingers': null,
                    'Sudden numbness together with chest pain': null,
                }
            },
            'Weakness in right arm': {
                soru: 'How is the weakness?',
                seçenekler: {
                    'Sudden onset, with weakness in the face too': null,
                    'Weakness that appears with a specific movement': null,
                    'Slowly increasing, lasting for days': null,
                }
            },
            'Swelling in right arm': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Swelling after trauma': null,
                    'With redness and warmth': null,
                    'Slowly growing, painless swelling': null,
                }
            },
        }
    },

    'sol el arka': {
        label: 'Left Hand',
        icon: 'back_hand',
        soru: 'What is your left hand complaint?',
        seçenekler: {
            'Left hand pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with morning joint stiffness': null,
                    'Pain that started after trauma': null,
                    'Pain that worsens with repetitive movements': null,
                }
            },
            'Numbness in left hand': {
                soru: 'When does the numbness occur?',
                seçenekler: {
                    'Numb while sleeping at night': null,
                    'Constantly numb': null,
                    'Numb in a certain position': null,
                }
            },
            'Tremor in left hand': {
                soru: 'How is the tremor?',
                seçenekler: {
                    'Tremor at rest': null,
                    'Tremor that increases when trying to hold something': null,
                    'Tremor that increases with stress or excitement': null,
                }
            },
            'Left wrist pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with swelling after trauma': null,
                    'Pain that worsens with repetitive movements': null,
                    'Pain with morning stiffness': null,
                }
            },
        }
    },

    'sağ el arka': {
        label: 'Right Hand',
        icon: 'back_hand',
        soru: 'What is your right hand complaint?',
        seçenekler: {
            'Right hand pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with morning joint stiffness': null,
                    'Pain that started after trauma': null,
                    'Pain that worsens with repetitive movements': null,
                }
            },
            'Numbness in right hand': {
                soru: 'When does the numbness occur?',
                seçenekler: {
                    'Numb while sleeping at night': null,
                    'Constantly numb': null,
                    'Numb in a certain position': null,
                }
            },
            'Tremor in right hand': {
                soru: 'How is the tremor?',
                seçenekler: {
                    'Tremor at rest': null,
                    'Tremor that increases when trying to hold something': null,
                    'Tremor that increases with stress or excitement': null,
                }
            },
            'Right wrist pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Pain with swelling after trauma': null,
                    'Pain that worsens with repetitive movements': null,
                    'Pain with morning stiffness': null,
                }
            },
        }
    },

    'sol bacak arka': {
        label: 'Back of Left Leg',
        icon: 'directions_walk',
        soru: 'What is your left leg (back side) complaint?',
        seçenekler: {
            'Pain in back of left leg': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when walking': null,
                    'Sciatica-like radiating pain': null,
                    'Muscle tightness': null,
                }
            },
            'Left calf cramp': {
                soru: 'How is the cramp?',
                seçenekler: {
                    'Cramp during sleep at night': null,
                    'Cramp after walking/exercise': null,
                    'Frequently recurring, lasting for days': null,
                }
            },
            'Numbness in left leg': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Appears after sitting for a long time': null,
                    'Constant numbness': null,
                }
            },
        }
    },

    'sağ bacak arka': {
        label: 'Back of Right Leg',
        icon: 'directions_walk',
        soru: 'What is your right leg (back side) complaint?',
        seçenekler: {
            'Pain in back of right leg': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse when walking': null,
                    'Sciatica-like radiating pain': null,
                    'Muscle tightness': null,
                }
            },
            'Right calf cramp': {
                soru: 'How is the cramp?',
                seçenekler: {
                    'Cramp during sleep at night': null,
                    'Cramp after walking/exercise': null,
                    'Frequently recurring, lasting for days': null,
                }
            },
            'Numbness in right leg': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Appears after sitting for a long time': null,
                    'Constant numbness': null,
                }
            },
        }
    },

    'sol ayak arka': {
        label: 'Left Foot',
        icon: 'directions_walk',
        soru: 'What is your left foot complaint?',
        seçenekler: {
            'Left heel pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worst on first steps in the morning (suspected heel spur)': null,
                    'Worse after standing for a long time': null,
                    'Started after sports/running': null,
                }
            },
            'Left sole of foot pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse on first steps in the morning': null,
                    'Worse after walking for a long time': null,
                    'Burning / stabbing type pain': null,
                }
            },
            'Numbness in left foot': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Widespread numbness in both feet': null,
                    'Worse after standing for a long time': null,
                }
            },
            'Left foot swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Worse by end of day, in both feet': null,
                    'In one foot only, with pain and redness': null,
                    'Swelling after trauma': null,
                }
            },
        }
    },

    'sağ ayak arka': {
        label: 'Right Foot',
        icon: 'directions_walk',
        soru: 'What is your right foot complaint?',
        seçenekler: {
            'Right heel pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worst on first steps in the morning (suspected heel spur)': null,
                    'Worse after standing for a long time': null,
                    'Started after sports/running': null,
                }
            },
            'Right sole of foot pain': {
                soru: 'How is the pain?',
                seçenekler: {
                    'Worse on first steps in the morning': null,
                    'Worse after walking for a long time': null,
                    'Burning / stabbing type pain': null,
                }
            },
            'Numbness in right foot': {
                soru: 'How is the numbness?',
                seçenekler: {
                    'Numbness radiating from the lower back': null,
                    'Widespread numbness in both feet': null,
                    'Worse after standing for a long time': null,
                }
            },
            'Right foot swelling': {
                soru: 'How is the swelling?',
                seçenekler: {
                    'Worse by end of day, in both feet': null,
                    'In one foot only, with pain and redness': null,
                    'Swelling after trauma': null,
                }
            },
        }
    },
};

// ── Aktif dil seçimi ──────────────────────
// initBodyMap() / setBodyMapLang() tarafından güncellenir.
let currentLang = 'tr';
function getTree() {
    return currentLang === 'en' ? DRILL_DOWN_EN : DRILL_DOWN_TR;
}
function loc() {
    return STRINGS[currentLang] || STRINGS.tr;
}

// ── BODY MAP CONTROLLER ─────────────────────

let _allParts = null;
let _popupContainer = null;
let _inputEl = null;
let _analyzeBtn = null;

export function initBodyMap(inputEl, analyzeBtn, lang = 'tr') {
    currentLang = lang === 'en' ? 'en' : 'tr';
    _inputEl = inputEl;
    _analyzeBtn = analyzeBtn;
    _allParts = document.querySelectorAll('.bp');
    _popupContainer = document.getElementById('bmPanel');

    _allParts.forEach(part => {
        part.addEventListener('click', function (e) {
            e.stopPropagation();
            const region = this.getAttribute('data-region');
            if (!region || !getTree()[region]) return;

            _allParts.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            openDrillDown(region, [], _popupContainer, inputEl, analyzeBtn);
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#bmPanel') && !e.target.closest('.bp')) {
            closePopup(_popupContainer);
            _allParts.forEach(p => p.classList.remove('active'));
        }
    });
}

// Arayüz dili değiştiğinde script.js tarafından çağrılır.
// Açık olan popup'ı kapatır (eski dildeki metinler kalmasın) ve
// sonraki tıklamalardan itibaren doğru ağacı/metinleri kullanır.
export function setBodyMapLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'tr';
    if (_popupContainer) {
        closePopup(_popupContainer);
    }
    if (_allParts) {
        _allParts.forEach(p => p.classList.remove('active'));
    }
}

// ── DÜZELTME 1: getNode null-safe yapıldı ──
function getNode(rootNode, breadcrumb) {
    let current = rootNode;
    for (const step of breadcrumb) {
        // null olan leaf node'a gelince dur, null döndür
        if (current === null || current === undefined) return null;
        if (!current.seçenekler || !(step in current.seçenekler)) return null;
        current = current.seçenekler[step];
    }
    return current;
}

function openDrillDown(region, breadcrumb, container, inputEl, analyzeBtn) {
    const rootNode = getTree()[region];
    if (!rootNode) return;

    // ── DÜZELTME 2: breadcrumb boşken direkt rootNode kullan ──
    const node = breadcrumb.length === 0 ? rootNode : getNode(rootNode, breadcrumb);
    if (!node) return;

    // ── DÜZELTME 3: null olan node'a gelince direkt finalizeSelection çağır ──
    // (bu durum normalde onSelect içinde yakalanıyor, ama güvenlik için burada da kontrol)
    if (node === null) {
        finalizeSelection(breadcrumb, rootNode.label, inputEl, analyzeBtn);
        showAddedBanner(region, breadcrumb.slice(0, -1), container, inputEl, analyzeBtn, rootNode.label, breadcrumb[breadcrumb.length - 1]);
        return;
    }

    const choices = Object.keys(node.seçenekler || {});
    if (choices.length === 0) return;

    const question = node.soru || rootNode.soru;
    const regionLabel = rootNode.label;
    const BILMIYORUM = loc().bmDontKnow;
    const allChoices = [...choices, BILMIYORUM];

    const popup = buildPopup({
        regionLabel,
        breadcrumb,
        question,
        choices: allChoices,
        onSelect: (choice) => {
            if (choice === BILMIYORUM) {
                // Bilmiyorum seçildi: breadcrumb'daki son seçimi veya bölge adını yaz
                const fallbackBreadcrumb = breadcrumb.length > 0
                    ? breadcrumb
                    : [regionLabel];
                finalizeSelection(fallbackBreadcrumb, regionLabel, inputEl, analyzeBtn);
                showAddedBanner(region, [], container, inputEl, analyzeBtn, regionLabel, fallbackBreadcrumb[fallbackBreadcrumb.length - 1]);
                return;
            }

            const newBreadcrumb = [...breadcrumb, choice];
            // ── DÜZELTME 4: childNode null kontrolü düzgün yapılıyor ──
            const childNode = (node.seçenekler || {})[choice];

            if (childNode !== null && childNode !== undefined && childNode.seçenekler) {
                // Alt seçenekler var → bir seviye derine in
                openDrillDown(region, newBreadcrumb, container, inputEl, analyzeBtn);
            } else {
                // Leaf node (null veya seçeneksiz) → seçimi tamamla
                finalizeSelection(newBreadcrumb, regionLabel, inputEl, analyzeBtn);
                showAddedBanner(region, breadcrumb, container, inputEl, analyzeBtn, regionLabel, choice);
            }
        },
        onBack: breadcrumb.length > 0 ? () => {
            openDrillDown(region, breadcrumb.slice(0, -1), container, inputEl, analyzeBtn);
        } : null,
        onClose: () => {
            closePopup(container);
            document.querySelectorAll('.bp').forEach(p => p.classList.remove('active'));
        }
    });

    container.innerHTML = '';
    container.appendChild(popup);
    container.style.display = 'block';

    // NOT: Kullanıcı bir bölgeye tıkladığında panel (soru/seçenekler)
    // özellikle mobilde ekranın altında kalabiliyordu — kullanıcı elle
    // aşağı kaydırmak zorunda kalıyordu. block:'nearest' sayesinde panel
    // zaten görünürdeyse HİÇBİR ŞEY olmuyor (gereksiz zıplama yok), sadece
    // görünür alanın dışındaysa nazikçe kaydırıyor.
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showAddedBanner(region, breadcrumb, container, inputEl, analyzeBtn, regionLabel, addedChoice) {
    const panel = document.createElement('div');
    panel.className = 'drill-panel';
    panel.innerHTML = `
    <div class="drill-region-title">
      ${regionLabel}
      <button class="drill-close-btn" aria-label="${loc().bmClose}">✕</button>
    </div>
    <div class="drill-done-banner">
      <span class="material-symbols-outlined">check_circle</span>
      <span>${loc().bmAdded(addedChoice)}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
      <button class="drill-opt" id="drillAddMore">
        <span>${loc().bmAddMore}</span>
        <span class="material-symbols-outlined">add</span>
      </button>
      <button class="drill-opt" id="drillAnalyze" style="background:var(--blue-50);color:var(--blue-800);font-weight:600">
        <span>${loc().bmStartAnalysis}</span>
        <span class="material-symbols-outlined">search</span>
      </button>
    </div>
  `;

    panel.querySelector('.drill-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        closePopup(container);
        document.querySelectorAll('.bp').forEach(p => p.classList.remove('active'));
    });
    panel.querySelector('#drillAddMore').addEventListener('click', (e) => {
        e.stopPropagation();
        openDrillDown(region, [], container, inputEl, analyzeBtn);
    });
    panel.querySelector('#drillAnalyze').addEventListener('click', (e) => {
        e.stopPropagation();
        closePopup(container);
        document.querySelectorAll('.bp').forEach(p => p.classList.remove('active'));
        analyzeBtn.click();
    });

    container.innerHTML = '';
    container.appendChild(panel);
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── DÜZELTME 5: back butonu null-safe querySelector ──
function buildPopup({ regionLabel, breadcrumb, question, choices, onSelect, onBack, onClose }) {
    const panel = document.createElement('div');
    panel.className = 'drill-panel';

    const breadcrumbHtml = breadcrumb.length > 0
        ? `<div class="drill-breadcrumb">
        ${breadcrumb.map((b, i) =>
            `<span class="${i === breadcrumb.length - 1 ? 'drill-crumb drill-crumb-cur' : 'drill-crumb'}">${b}</span>`
        ).join('<span class="drill-sep">›</span>')}
       </div>`
        : '';

    const backRow = onBack
        ? `<div class="drill-back-row">
         <button class="drill-back-btn" aria-label="${loc().bmBack}">
           <span class="material-symbols-outlined">arrow_back</span>${loc().bmBack}
         </button>
       </div>`
        : '';

    panel.innerHTML = `
    <div class="drill-region-title">
      ${regionLabel}
      <button class="drill-close-btn" aria-label="${loc().bmClose}">✕</button>
    </div>
    ${backRow}
    ${breadcrumbHtml}
    <div class="drill-question">${question}</div>
    <div class="drill-options">
      ${choices.map(c => `
        <button class="drill-opt" data-choice="${c.replace(/"/g, '&quot;')}">
          <span>${c}</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </button>`).join('')}
    </div>
  `;

    panel.querySelector('.drill-close-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        onClose();
    });

    // ── DÜZELTME 5: sadece onBack varsa listener ekle ──
    if (onBack) {
        panel.querySelector('.drill-back-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            onBack();
        });
    }

    panel.querySelectorAll('.drill-opt').forEach(btn => {
        const choice = btn.getAttribute('data-choice');
        if (!choice) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onSelect(choice);
        });
    });

    return panel;
}

function finalizeSelection(breadcrumb, regionLabel, inputEl, analyzeBtn) {
    const symptomText = buildSymptomText(breadcrumb, regionLabel);
    const current = inputEl.value.trim();
    inputEl.value = current ? current + ', ' + symptomText : symptomText;

    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = inputEl.value.length;

    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 180) + 'px';

    if (analyzeBtn) {
        analyzeBtn.classList.add('btn-highlight');
        setTimeout(() => analyzeBtn.classList.remove('btn-highlight'), 2000);
    }

    // NOT: Daha önce inputEl.focus() sade çağrılıyordu. Mobil tarayıcılar
    // odaklanan bir input'u görünür kılmak için sayfayı KENDİLİĞİNDEN
    // kaydırıyor — bu da hemen ardından görünen "Analizi Başlat" panelinin
    // konumunu değiştirip kullanıcıya rastgele bir "zıplama" hissi
    // veriyordu (vücut haritasından seçim → beklenmedik kayma). preventScroll
    // ile input yine odaklanıyor (yazı imleci doğru yerde duruyor) ama
    // tarayıcı artık sayfayı kendiliğinden kaydırmıyor.
    inputEl.focus({ preventScroll: true });
    inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
}

function buildSymptomText(breadcrumb, regionLabel) {
    const last = breadcrumb[breadcrumb.length - 1];
    const regionKeywords = regionLabel.toLowerCase().split(' ');
    const lastLower = last.toLowerCase();
    const hasRegion = regionKeywords.some(kw => kw.length > 2 && lastLower.includes(kw));
    return hasRegion ? last : `${last} (${regionLabel})`;
}

function closePopup(container) {
    container.innerHTML = `<div class="bm-hint"><span class="material-symbols-outlined">touch_app</span><span>${loc().bodyMapHint}</span></div>`;
    container.style.display = '';
}