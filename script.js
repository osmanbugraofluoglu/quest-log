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

// 3. OYUNUN MATEMATİKSEL DEĞERLERİ
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

    saveStatsToLocalStorage(); //istatistikler değişti hemen not ediyoruz
};

// 4. GÖREV EKLEME FONKSİYONU (ARROW FUNCTION)
const addTask = (savedText = null, isCompleted = false) => {
    // Eğer dışarıdan metin gelmişse onu kullan, gelmemişse kutudaki yazıyı al
    const taskText = savedText || taskInput.value.trim();

    if (taskText === "" || taskText === null) { // Boşluk kontrolü
        // Eğer hafızadan yükleme yapmıyorsak (yani manuel ekliyorsak) uyarı ver
        if(!savedText) alert("Lütfen bir görev yazın!"); 
        return;
    }
    //Yeni bir HTML elemanı (li) yarat ve giydir
    const newTaskItem = document.createElement("li");
    newTaskItem.className = "task-item";

    // Görev metni için bir span  oluşturalım
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // BUTON KAPSAYICISI 
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

        // Kartı Aktifler listesinden al, "Tamamlananlar" listesine taşı
        const completedTaskList = document.getElementById("completed-task-list");
        completedTaskList.appendChild(newTaskItem);

        // Tamamlanan görevde artık butona gerek yok
        completeBtn.remove();

        currentXP += 30; 
        updateUI();
        
        totalCompleted++;
        totalEarnedXP += 30; 

        updateExtraStatsUI(); // Ekranda rakamları anında günceller

        saveTasksToLocalStorage();
    })

    // SİL BUTONU EYLEMİ
    deleteBtn.addEventListener('click', () => {
        
        // Kartın üstünde "completed" sınıfı yoksa artır
        if (!newTaskItem.classList.contains("completed")) {
            totalDeleted++; // Sadece aktif bir görevden vazgeçildiyse sayıyı artır
        }

        // Kartı her halükarda dünyadan tamamen sil
        newTaskItem.remove();

        saveTasksToLocalStorage(); // Görev silindi, listeyi güncelle

        // Yeni rakamları istatistik paneline yansıt
        updateExtraStatsUI(); 
    });

    // ELEMANLARI BİRBİRİNE BAĞLAMA)
    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(deleteBtn);

    newTaskItem.appendChild(taskSpan);
    newTaskItem.appendChild(btnContainer);

    // HANGİ LİSTEYE GİDECEK KONTROLÜ
    if (isCompleted) {
        // Eğer hafızadan "tamamlanmış" olarak geliyorsa
        newTaskItem.classList.add("completed");
        completeBtn.remove(); // Tamamlanan görevde bu buton olmaz
        document.getElementById("completed-task-list").appendChild(newTaskItem);
    } else {
        // Normal yeni görevse
        taskList.appendChild(newTaskItem);
    }
    //İşlem bitince yazı kutusunu temizle
    taskInput.value = "";

    //İMLEÇ TEKRAR KUTUYA GELSİN
    taskInput.focus();

    saveTasksToLocalStorage(); // Yeni görev geldi, listeyi güncelle

};
// 5. BUTONA TIKLAMA OLAYINI DİNLEME (EVENT LISTENER)
// addTask'ı doğrudan yazarsan içine 'Event' paketini gönderir. 
// Boş bir ok fonksiyonu ile çağırırsan tertemiz, argümansız çağırır.
addTaskBtn.addEventListener("click", () => addTask());

// 6. İSTATİSTİK GÜNCELLEME FONKSİYONU
const updateUI = () => {
    // Seviye atlama kontrolünü en başta, mola vermeden yap
    if (currentXP >= requiredXP) {
        currentXP = currentXP - requiredXP;
        currentLevel++;
        requiredXP += 30;
        alert(`TEBRİKLER! ${currentLevel}. Seviyeye Yükseldin.`);
    }

    // Her şeyi tek seferde ekrana bas
    levelValueElement.textContent = currentLevel;
    xpValueElement.textContent = `${currentXP} / ${requiredXP}`;

    const xpPercentage = (currentXP / requiredXP) * 100;
    xpBarFillElement.style.width = xpPercentage + "%";
    saveStatsToLocalStorage(); //sayilar burada değişti ve hemen not ediyoruz
};

// YENİ VERİLERİ HAFIZAYA KAYDETME FONKSİYONU
const saveStatsToLocalStorage = () => {
    localStorage.setItem("currentLevel", currentLevel);
    localStorage.setItem("currentXP", currentXP);
    localStorage.setItem("requiredXP", requiredXP);
    localStorage.setItem("totalCompleted", totalCompleted);
    localStorage.setItem("totalDeleted", totalDeleted);
    localStorage.setItem("totalEarnedXP", totalEarnedXP);
};

// 11. GÖREV LİSTESİNİ HAFIZAYA KAYDETME
const saveTasksToLocalStorage = () => {
    const activeTasks = [];
    const completedTasks = [];

    // 1. Aktif görevleri topla
    document.querySelectorAll("#task-list .task-item span").forEach(span => {
        activeTasks.push(span.textContent);
    });

    // 2. Tamamlanan görevleri topla
    document.querySelectorAll("#completed-task-list .task-item span").forEach(span => {
        completedTasks.push(span.textContent);
    });
    
    // İkisini ayrı ayrı hafızaya yaz
    localStorage.setItem("savedTasks", JSON.stringify(activeTasks));
    localStorage.setItem("savedCompletedTasks", JSON.stringify(completedTasks));
};

// 7. HAFIZADAN VERİLERİ YÜKLEME FONKSİYONU
const loadStatsFromLocalStorage = () => {
    // Eğer Local Storage'da "currentLevel" diye bir kayıt varsa, demek ki daha önce oynanmış.
    if (localStorage.getItem("currentLevel") !== null) {
        // parseInt ile hafızadaki "yazıları" tekrar matematiksel sayılara çevirip değişkenlerimize eşitliyoruz.
        currentLevel = parseInt(localStorage.getItem("currentLevel"));
        currentXP = parseInt(localStorage.getItem("currentXP"));
        requiredXP = parseInt(localStorage.getItem("requiredXP"));
        
        totalCompleted = parseInt(localStorage.getItem("totalCompleted"));
        totalDeleted = parseInt(localStorage.getItem("totalDeleted"));
        totalEarnedXP = parseInt(localStorage.getItem("totalEarnedXP"));
    }
    // --- GÖREV LİSTELERİNİ GERİ YÜKLEME ---
    // ÖNCE İKİSİNİ DE HAFIZADAN OKUYUP CEBE KOYUYORUZ (Üzerine yazılmayı önlemek için)
    const savedTasksJSON = localStorage.getItem("savedTasks");
    const savedCompletedJSON = localStorage.getItem("savedCompletedTasks");

    // SONRA AKTİFLERİ EKRANA BASIYORUZ
    if (savedTasksJSON !== null) {
        const tasksArray = JSON.parse(savedTasksJSON);
        tasksArray.forEach(taskText => {
            addTask(taskText, false);
        });
    }

    // EN SON TAMAMLANANLARI EKRANA BASIYORUZ
    if (savedCompletedJSON !== null) {
        const completedArray = JSON.parse(savedCompletedJSON);
        completedArray.forEach(taskText => {
            addTask(taskText, true);
        });
    }
};

// ENTER TUŞU İLE EKLEME ÖZELLİĞİ
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// 8. SAYFA İLK AÇILDIĞINDA ÇALIŞACAK MOTOR
// Önce hafızadaki verileri çekip değişkenlerimizi güncelliyoruz
loadStatsFromLocalStorage();

// Sonra güncellenmiş bu sayıları ekrandaki HTML arayüzüne (UI) basıyoruz
updateUI();
updateExtraStatsUI();

// 10. İLERLEMEYİ SIFIRLAMA 
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", () => {
    // Tarayıcının kendi onay kutusunu çıkarıyoruz
    const isConfirmed = confirm("Tüm seviye ve XP verilerin silinecek. Emin misin?");

    if (isConfirmed) {
        localStorage.clear(); // Bütün verileri siler
        location.reload();    // Sayfayı F5 yapmışsın gibi yeniler
    }
});