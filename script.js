// 1. GÖREV EKLEME VE LİSTE ELEMANLARI
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const statCompletedElement = document.getElementById("stat-completed");
const statDeletedElement = document.getElementById("stat-deleted");
const statTotalXpElement = document.getElementById("stat-total-xp");

// 2. RPG İSTATİSTİK ELEMANLARI (DOM)
const levelValueElement = document.getElementById("level-value");
const xpValueElement = document.getElementById("xp-value");
const xpBarFillElement = document.getElementById("xp-bar-fill");

// 3. OYUNUN MATEMATİKSEL DEĞERLERİ (STATE)
let currentLevel = 1;
let currentXP = 0;
let requiredXP = 100;
let tasks = [];

let totalCompleted = 0;
let totalDeleted = 0;
let totalEarnedXP = 0;

// İSTATİSTİKLERİ EKRANA YAZDIRMA
const updateExtraStatsUI = () => {
    statCompletedElement.textContent = totalCompleted;
    statDeletedElement.textContent = totalDeleted;
    statTotalXpElement.textContent = totalEarnedXP;
};

// 4. GÖREV EKLEME FONKSİYONU (ARROW FUNCTION)
const addTask = () => {
    //Kutudaki yazıyı al ve etrafındaki boşlukları sil (trim)
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Lütfen bir görev yazın!");
        return
    }
    //Yeni bir HTML elemanı (li) yarat ve giydir
    const newTaskItem = document.createElement("li");
    newTaskItem.className = "task-item";

    // Görev metni için bir span (yazı kutusu) oluşturalım
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // BUTON KAPSAYICISI (Sağ tarafa butonları dizmek için)
    const btnContainer = document.createElement("div");
    btnContainer.className = "task-buttons";

    // Tamamla Butonu
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Tamamla";
    completeBtn.className = "complete-btn";

    // Sil Butonu
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.className = "delete-btn";

    // TAMAMLA BUTONU EYLEMİ (Işınlanma ve Stil)
    completeBtn.addEventListener('click', () => {

        //KARTI TAMAMLANDI STİLİNE SOK
        newTaskItem.classList.add("completed");

        // Kartı "Aktifler" listesinden al, "Tamamlananlar" listesine taşı
        const completedTaskList = document.getElementById("completed-task-list");
        completedTaskList.appendChild(newTaskItem);

        // Tamamlanan görevde artık butona gerek yok, butonu kaldır
        completeBtn.remove();

        currentXP += 30; //puanı artır
        updateUI();
        
        console.log("Görev başarıyla tamamlananlara taşındı!");
        totalCompleted++; // Tamamlanan sayısını 1 artırır
        totalEarnedXP += 30; 
        updateExtraStatsUI(); // Ekranda rakamları anında günceller
    })

    // SİL BUTONU EYLEMİ
    deleteBtn.addEventListener('click', () => {
        
        // 1. ADALET KONTROLÜ: Kartın üstünde "completed" sınıfı YOKSA cezayı kes
        if (!newTaskItem.classList.contains("completed")) {
            totalDeleted++; // Sadece aktif bir görevden vazgeçildiyse sayıyı artır
        }

        // 2. İNFAZ: Kartı her halükarda dünyadan (DOM'dan) tamamen sil
        newTaskItem.remove();

        // 3. EKRANI GÜNCELLE: Yeni rakamları istatistik paneline yansıt
        updateExtraStatsUI(); 
    });

    // ELEMANLARI BİRBİRİNE BAĞLAMA (İç içe yerleştirme)
    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(deleteBtn);

    newTaskItem.appendChild(taskSpan);
    newTaskItem.appendChild(btnContainer);

    //yeni elemanı sayfadaki listeye (ul) ekle
    taskList.appendChild(newTaskItem);

    //İşlem bitince yazı kutusunu temizle
    taskInput.value = "";

    //İMLEÇ TEKRAR KUTUYA GELSİN
    taskInput.focus();

};
// 5. BUTONA TIKLAMA OLAYINI DİNLEME (EVENT LISTENER)
addTaskBtn.addEventListener("click", addTask);

// 6. İSTATİSTİK GÜNCELLEME FONKSİYONU
const updateUI = () => {
    // 1. Seviye atlama kontrolünü en başta, mola vermeden yap
    if (currentXP >= requiredXP) {
        currentXP = currentXP - requiredXP;
        currentLevel++;
        requiredXP += 50;
        alert(`TEBRİKLER! ${currentLevel}. Seviyeye Yükseldin.`);
    }

    // 2. Her şeyi tek seferde ekrana bas
    levelValueElement.textContent = currentLevel;
    xpValueElement.textContent = `${currentXP} / ${requiredXP}`;

    const xpPercentage = (currentXP / requiredXP) * 100;
    xpBarFillElement.style.width = xpPercentage + "%";
};

// 7. ENTER TUŞU İLE EKLEME ÖZELLİĞİ
taskInput.addEventListener("keypress", (e) => {
    // Eğer basılan tuşun adı "Enter" ise
    if (e.key === "Enter") {
        addTask(); // Görev ekleme fonksiyonunu çalıştır
    }
});

