// ============================================
// SağlıkYön – Body Map Drill-Down v2
// Kullanım: initBodyMap(inputEl, analyzeBtnEl)
// ============================================

const DRILL_DOWN = {

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
            'Yüz ağrısı / şişliği': null,
            'Kulak ağrısı': null,
            'Kulakta çınlama': null,
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
            'Boyunda şişlik / kitle': null,
            'Nefes yutma güçlüğü': null,
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
            'Mide yanması / reflü': null,
            'Bulantı': {
                soru: 'Bulantı tek başına mı?',
                seçenekler: {
                    'Sadece bulantı var': null,
                    'Kusmayla birlikte': null,
                    'Baş dönmesiyle birlikte': null,
                }
            },
            'Şişkinlik / gaz': null,
            'Sarılık (cilt/göz sarardı)': null,
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
            'Kabızlık': null,
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
            'Kasık ağrısı sol': null,
            'Sol kasıkta şişlik': null,
            'İdrar yaparken ağrı': null,
        }
    },

    'kasık sağ': {
        label: 'Sağ Kasık',
        icon: 'airline_seat_flat',
        soru: 'Sağ kasık şikayeti?',
        seçenekler: {
            'Kasık ağrısı sağ': null,
            'Sağ kasıkta şişlik': null,
            'Apandis bölgesinde ağrı': null,
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
            'Güçsüzlük': null,
            'Uyuşma / karıncalanma': null,
        }
    },

    'sol ön kol': {
        label: 'Sol Ön Kol',
        icon: 'back_hand',
        soru: 'Sol ön kol şikayeti?',
        seçenekler: {
            'Ön kol ağrısı': null,
            'Uyuşma / karıncalanma': null,
            'Kas krampı': null,
        }
    },

    'sol el': {
        label: 'Sol El / Bilek',
        icon: 'back_hand',
        soru: 'Sol el / bilek şikayeti?',
        seçenekler: {
            'El ağrısı': null,
            'Bilek ağrısı': null,
            'El uyuşması (geceleri de var mı?)': {
                soru: 'Uyuşma ne zaman?',
                seçenekler: {
                    'Gece uyurken uyuşuyor': null,
                    'Sürekli uyuşuyor': null,
                    'Belirli pozisyonda uyuşuyor': null,
                }
            },
            'El titremesi': null,
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
                }
            },
            'Güçsüzlük': null,
            'Uyuşma / karıncalanma': null,
        }
    },

    'sağ ön kol': {
        label: 'Sağ Ön Kol',
        icon: 'back_hand',
        soru: 'Sağ ön kol şikayeti?',
        seçenekler: {
            'Ön kol ağrısı': null,
            'Uyuşma / karıncalanma': null,
            'Kas krampı': null,
        }
    },

    'sağ el': {
        label: 'Sağ El / Bilek',
        icon: 'back_hand',
        soru: 'Sağ el / bilek şikayeti?',
        seçenekler: {
            'El ağrısı': null,
            'Bilek ağrısı': null,
            'El uyuşması': {
                soru: 'Uyuşma ne zaman?',
                seçenekler: {
                    'Gece uyurken uyuşuyor': null,
                    'Sürekli uyuşuyor': null,
                    'Belirli pozisyonda uyuşuyor': null,
                }
            },
            'El titremesi': null,
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
            'Uyuşma': null,
            'Şişlik': null,
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
            'Uyuşma': null,
            'Şişlik': null,
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
            'Diz şişliği': null,
            'Diz kilitlenmesi': null,
            'Dizde ses / çıtırtı': null,
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
            'Diz şişliği': null,
            'Diz kilitlenmesi': null,
            'Dizde ses / çıtırtı': null,
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
            'Baldır krampı': null,
            'Şişlik / kızarıklık': null,
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
            'Baldır krampı': null,
            'Şişlik / kızarıklık': null,
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
            'Ayak şişliği': null,
            'Ayakta uyuşma': null,
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
            'Ayak şişliği': null,
            'Ayakta uyuşma': null,
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
            'Kafa arkasında zonklama': null,
        }
    },

    'boyun arka': {
        label: 'Boyun / Ense',
        icon: 'accessibility_new',
        soru: 'Boyun/ense şikayeti?',
        seçenekler: {
            'Boyun tutulması': null,
            'Kola yayılan ağrı': null,
            'Boyun fıtığı şüphesi': null,
        }
    },

    'sol omuz arka': {
        label: 'Sol Kürek',
        icon: 'accessibility_new',
        soru: 'Sol kürek / omuz şikayeti?',
        seçenekler: {
            'Kürek kemiği ağrısı': null,
            'Sırt ağrısı sol': null,
            'Kol kaldırınca ağrı': null,
        }
    },

    'sağ omuz arka': {
        label: 'Sağ Kürek',
        icon: 'accessibility_new',
        soru: 'Sağ kürek / omuz şikayeti?',
        seçenekler: {
            'Kürek kemiği ağrısı': null,
            'Sırt ağrısı sağ': null,
            'Yağlı yemek sonrası sağ sırt ağrısı': null,
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
            'Sırt gerginliği': null,
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
            'Bel tutulması': null,
            'Bel fıtığı şüphesi': null,
        }
    },

    'kalça sol': {
        label: 'Sol Kalça',
        icon: 'directions_walk',
        soru: 'Sol kalça şikayeti?',
        seçenekler: {
            'Kalça ağrısı': null,
            'Oturma ağrısı': null,
            'Yürüyünce topallama': null,
        }
    },

    'kalça sağ': {
        label: 'Sağ Kalça',
        icon: 'directions_walk',
        soru: 'Sağ kalça şikayeti?',
        seçenekler: {
            'Kalça ağrısı': null,
            'Oturma ağrısı': null,
            'Yürüyünce topallama': null,
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
            'Sol omuz sertliği': null,
            'Sol kol kaldırınca ağrı': null,
            'Sol omuz şişliği': null,
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
            'Sağ omuz sertliği': null,
            'Sağ kol kaldırınca ağrı': null,
            'Sağ omuz şişliği': null,
        }
    },

    'sol kol arka': {
        label: 'Sol Kol',
        icon: 'back_hand',
        soru: 'Sol kol şikayeti?',
        seçenekler: {
            'Sol kol ağrısı': null,
            'Sol kolda uyuşma': null,
            'Sol kolda güçsüzlük': null,
            'Sol kolda şişlik': null,
        }
    },

    'sağ kol arka': {
        label: 'Sağ Kol',
        icon: 'back_hand',
        soru: 'Sağ kol şikayeti?',
        seçenekler: {
            'Sağ kol ağrısı': null,
            'Sağ kolda uyuşma': null,
            'Sağ kolda güçsüzlük': null,
            'Sağ kolda şişlik': null,
        }
    },

    'sol el arka': {
        label: 'Sol El',
        icon: 'back_hand',
        soru: 'Sol el şikayeti?',
        seçenekler: {
            'Sol el ağrısı': null,
            'Sol el uyuşması': null,
            'Sol el titremesi': null,
            'Sol bilek ağrısı': null,
        }
    },

    'sağ el arka': {
        label: 'Sağ El',
        icon: 'back_hand',
        soru: 'Sağ el şikayeti?',
        seçenekler: {
            'Sağ el ağrısı': null,
            'Sağ el uyuşması': null,
            'Sağ el titremesi': null,
            'Sağ bilek ağrısı': null,
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
            'Sol baldır krampı': null,
            'Sol bacakta uyuşma': null,
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
            'Sağ baldır krampı': null,
            'Sağ bacakta uyuşma': null,
        }
    },

    'sol ayak arka': {
        label: 'Sol Ayak',
        icon: 'directions_walk',
        soru: 'Sol ayak şikayeti?',
        seçenekler: {
            'Sol topuk ağrısı': null,
            'Sol ayak tabanı ağrısı': null,
            'Sol ayakta uyuşma': null,
            'Sol ayak şişliği': null,
        }
    },

    'sağ ayak arka': {
        label: 'Sağ Ayak',
        icon: 'directions_walk',
        soru: 'Sağ ayak şikayeti?',
        seçenekler: {
            'Sağ topuk ağrısı': null,
            'Sağ ayak tabanı ağrısı': null,
            'Sağ ayakta uyuşma': null,
            'Sağ ayak şişliği': null,
        }
    },


};

// ── BODY MAP CONTROLLER ─────────────────────

export function initBodyMap(inputEl, analyzeBtn) {

    const allParts = document.querySelectorAll('.bp');
    const popupContainer = document.getElementById('bmPanel');

    allParts.forEach(part => {
        part.addEventListener('click', function (e) {
            e.stopPropagation();
            const region = this.getAttribute('data-region');
            if (!region || !DRILL_DOWN[region]) return;

            // Aktif bölge
            allParts.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            openDrillDown(region, [], popupContainer, inputEl, analyzeBtn);
        });
    });

    // Dışarı tıklayınca kapat
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#bmPanel') && !e.target.closest('.bp')) {
            closePopup(popupContainer);
            allParts.forEach(p => p.classList.remove('active'));
        }
    });
}

function openDrillDown(region, breadcrumb, container, inputEl, analyzeBtn) {
    const node = getNode(DRILL_DOWN[region], breadcrumb);
    if (!node) return;

    const choices = Object.keys(node.seçenekler || {});
    const question = node.soru || DRILL_DOWN[region].soru;
    const regionLabel = DRILL_DOWN[region].label;

    // Her seviyeye "bilmiyorum" seçeneği ekle
    const BILMIYORUM = '⚠ Tam olarak ne olduğunu bilmiyorum';
    const allChoices = [...choices, BILMIYORUM];

    const popup = buildPopup({
        regionLabel,
        breadcrumb,
        question,
        choices: allChoices,
        onSelect: (choice) => {
            const newBreadcrumb = [...breadcrumb, choice];
            const childNode = (node.seçenekler || {})[choice];

            if (childNode && childNode.seçenekler) {
                // Daha derin seviye var
                openDrillDown(region, newBreadcrumb, container, inputEl, analyzeBtn);
            } else {
                // Son seçim — metin kutusuna yaz, paneli AÇIK tut
                finalizeSelection(newBreadcrumb, regionLabel, inputEl, analyzeBtn);
                // Panel açık kalacak, "eklendi" banner + yeni seçim imkanı sun
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
}

function showAddedBanner(region, breadcrumb, container, inputEl, analyzeBtn, regionLabel, addedChoice) {
    const panel = document.createElement('div');
    panel.className = 'drill-panel';
    panel.innerHTML = `
    <div class="drill-region-title">
      ${regionLabel}
      <button class="drill-close-btn" aria-label="Kapat">✕</button>
    </div>
    <div class="drill-done-banner">
      <span class="material-symbols-outlined">check_circle</span>
      <span>"${addedChoice}" şikayet listesine eklendi.</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
      <button class="drill-opt" id="drillAddMore">
        <span>Bu bölgede başka şikayet ekle</span>
        <span class="material-symbols-outlined">add</span>
      </button>
      <button class="drill-opt" id="drillAnalyze" style="background:var(--blue-50);color:var(--blue-800);font-weight:600">
        <span>Analizi başlat</span>
        <span class="material-symbols-outlined">search</span>
      </button>
    </div>
  `;

    panel.querySelector('.drill-close-btn').addEventListener('click', () => {
        closePopup(container);
        document.querySelectorAll('.bp').forEach(p => p.classList.remove('active'));
    });
    panel.querySelector('#drillAddMore').addEventListener('click', () => {
        openDrillDown(region, [], container, inputEl, analyzeBtn);
    });
    panel.querySelector('#drillAnalyze').addEventListener('click', () => {
        closePopup(container);
        document.querySelectorAll('.bp').forEach(p => p.classList.remove('active'));
        analyzeBtn.click();
    });

    container.innerHTML = '';
    container.appendChild(panel);
}

function getNode(rootNode, breadcrumb) {
    let current = rootNode;
    for (const step of breadcrumb) {
        if (!current.seçenekler || !current.seçenekler[step]) return null;
        current = current.seçenekler[step];
    }
    return current;
}

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
         <button class="drill-back-btn" aria-label="Geri">
           <span class="material-symbols-outlined">arrow_back</span>Geri
         </button>
       </div>`
        : '';

    panel.innerHTML = `
    <div class="drill-region-title">
      ${regionLabel}
      <button class="drill-close-btn" aria-label="Kapat">✕</button>
    </div>
    ${backRow}
    ${breadcrumbHtml}
    <div class="drill-question">${question}</div>
    <div class="drill-options">
      ${choices.map(c => `
        <button class="drill-opt" data-choice="${c}">
          <span>${c}</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </button>`).join('')}
    </div>
  `;

    panel.querySelector('.drill-close-btn')?.addEventListener('click', onClose);
    panel.querySelector('.drill-back-btn')?.addEventListener('click', onBack);
    panel.querySelectorAll('.drill-opt').forEach(btn => {
        btn.addEventListener('click', () => onSelect(btn.getAttribute('data-choice')));
    });

    return panel;
}

function finalizeSelection(breadcrumb, regionLabel, inputEl, analyzeBtn) {
    // Seçimleri doğal Türkçe cümleye dönüştür
    const symptomText = buildSymptomText(breadcrumb, regionLabel);

    const current = inputEl.value.trim();
    if (current) {
        inputEl.value = current + ', ' + symptomText;
    } else {
        inputEl.value = symptomText;
    }

    // Char count güncelle
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = inputEl.value.length;

    // Textarea yüksekliği güncelle
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 180) + 'px';

    // Analiz butonunu vurgula
    if (analyzeBtn) {
        analyzeBtn.classList.add('btn-highlight');
        setTimeout(() => analyzeBtn.classList.remove('btn-highlight'), 2000);
    }

    // Odağı input'a ver
    inputEl.focus();
    inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
}

function buildSymptomText(breadcrumb, regionLabel) {
    // Son seçim en spesifik olanı — onu ana semptom yap
    const last = breadcrumb[breadcrumb.length - 1];

    // Eğer son seçim zaten bölge adını içeriyorsa direkt kullan
    const regionKeywords = regionLabel.toLowerCase().split(' ');
    const lastLower = last.toLowerCase();
    const hasRegion = regionKeywords.some(kw => lastLower.includes(kw));

    if (hasRegion) return last;

    // Yoksa bölge + son seçim
    return `${last} (${regionLabel})`;
}

function closePopup(container) {
    container.innerHTML = '';
    container.style.display = 'none';
}

// ── POPUP CSS ─────────────────────────────────
// Bu stilleri style.css'e ekle

export const BODY_MAP_CSS = `
.body-drill-popup {
  position: absolute;
  top: 0;
  left: calc(100% + 16px);
  width: 260px;
  background: var(--surface);
  border: 1px solid var(--outline-var);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
  z-index: 200;
  overflow: hidden;
  animation: slideIn 0.15s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.drill-header {
  padding: 14px 16px 10px;
  background: var(--surface-low);
  border-bottom: 1px solid var(--outline-var);
}

.drill-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.drill-back,
.drill-close {
  width: 32px;
  height: 32px;
  border-radius: var(--r-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-var);
  transition: background var(--t);
  cursor: pointer;
  border: none;
  background: none;
}

.drill-back:hover,
.drill-close:hover { background: var(--surface-mid); }

.drill-back .material-symbols-outlined,
.drill-close .material-symbols-outlined { font-size: 18px; }

.drill-region-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.02em;
}

.drill-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: 6px;
}

.drill-crumb {
  font-size: 11px;
  color: var(--outline);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drill-crumb-last {
  color: var(--on-surface-var);
  font-weight: 500;
}

.drill-sep {
  font-size: 11px;
  color: var(--outline-var);
}

.drill-question {
  font-size: 13px;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.4;
}

.drill-options {
  padding: 6px;
  max-height: 280px;
  overflow-y: auto;
}

.drill-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--r-md);
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background var(--t);
  gap: 8px;
}

.drill-option:hover {
  background: var(--primary-container);
}

.drill-option:hover .drill-option-text {
  color: var(--on-primary-cont);
}

.drill-option:hover .drill-option-arrow {
  color: var(--primary);
}

.drill-option-text {
  font-size: 13px;
  color: var(--on-surface);
  line-height: 1.4;
  flex: 1;
}

.drill-option-arrow {
  font-size: 16px;
  color: var(--outline-var);
  flex-shrink: 0;
}

/* Analiz butonu vurgu animasyonu */
.btn-highlight {
  animation: btnPulse 0.4s ease;
}

@keyframes btnPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.03); box-shadow: 0 0 0 6px rgba(0,70,136,0.15); }
  100% { transform: scale(1); }
}

/* Mobil: popup body map'ın altına geç */
@media (max-width: 600px) {
  .body-drill-popup {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 80px;
    top: auto;
    width: auto;
  }
}
`;