document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const addTextBtn = document.getElementById('add-text');
    const bgColorInput = document.getElementById('bg-color');
    const bgImageBtn = document.getElementById('bg-image');
    const bgSizeSelect = document.getElementById('bg-size');
    const textColorInput = document.getElementById('text-color');
    const fontSizeSelect = document.getElementById('font-size');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const fontFamilySelect = document.getElementById('font-family');
    const saveProjectBtn = document.getElementById('save-project');
    const loadProjectBtn = document.getElementById('load-project');
    
    let activeTextElement = null;
    
    // নতুন টেক্সট যোগ
    addTextBtn.addEventListener('click', function() {
        const textElement = document.createElement('div');
        textElement.className = 'text-element';
        textElement.contentEditable = 'true';
        textElement.textContent = 'এখানে লিখুন...';
        
        // র‍্যান্ডম পজিশন
        const x = Math.random() * (canvas.offsetWidth - 200);
        const y = Math.random() * (canvas.offsetHeight - 100);
        textElement.style.left = `${x}px`;
        textElement.style.top = `${y}px`;
        
        // ডিফল্ট স্টাইল
        textElement.style.color = textColorInput.value;
        textElement.style.fontSize = fontSizeSelect.value;
        
        canvas.appendChild(textElement);
        makeDraggable(textElement);
        setActiveTextElement(textElement);
    });
    
    // ব্যাকগ্রাউন্ড কালার পরিবর্তন
    bgColorInput.addEventListener('input', function() {
        canvas.style.backgroundColor = bgColorInput.value;
        canvas.style.backgroundImage = 'none';
    });
    
    // ব্যাকগ্রাউন্ড ইমেজ যোগ
    bgImageBtn.addEventListener('click', function() {
        const imageUrl = prompt('ইমেজ URL দিন:');
        if (imageUrl) {
            canvas.style.backgroundImage = `url(${imageUrl})`;
            canvas.style.backgroundColor = 'transparent';
        }
    });
    
    // ব্যাকগ্রাউন্ড সাইজ পরিবর্তন
    bgSizeSelect.addEventListener('change', function() {
        canvas.style.backgroundSize = bgSizeSelect.value;
    });
    
    // টেক্সট স্টাইল পরিবর্তন
    textColorInput.addEventListener('input', function() {
        if (activeTextElement) {
            activeTextElement.style.color = textColorInput.value;
        }
    });
    
    fontSizeSelect.addEventListener('change', function() {
        if (activeTextElement) {
            activeTextElement.style.fontSize = fontSizeSelect.value;
        }
    });
    
    boldBtn.addEventListener('click', function() {
        if (activeTextElement) {
            const isBold = activeTextElement.style.fontWeight === 'bold';
            activeTextElement.style.fontWeight = isBold ? 'normal' : 'bold';
            boldBtn.style.backgroundColor = isBold ? '#34495e' : '#3498db';
        }
    });
    
    italicBtn.addEventListener('click', function() {
        if (activeTextElement) {
            const isItalic = activeTextElement.style.fontStyle === 'italic';
            activeTextElement.style.fontStyle = isItalic ? 'normal' : 'italic';
            italicBtn.style.backgroundColor = isItalic ? '#34495e' : '#3498db';
        }
    });
    
    fontFamilySelect.addEventListener('change', function() {
        if (activeTextElement) {
            activeTextElement.style.fontFamily = fontFamilySelect.value;
        }
    });
    
    // প্রজেক্ট সেভ/লোড
    saveProjectBtn.addEventListener('click', function() {
        const project = {
            background: {
                color: canvas.style.backgroundColor,
                image: canvas.style.backgroundImage,
                size: canvas.style.backgroundSize
            },
            texts: []
        };
        
        document.querySelectorAll('.text-element').forEach(textEl => {
            project.texts.push({
                content: textEl.textContent,
                style: {
                    color: textEl.style.color,
                    fontSize: textEl.style.fontSize,
                    fontWeight: textEl.style.fontWeight,
                    fontStyle: textEl.style.fontStyle,
                    fontFamily: textEl.style.fontFamily,
                    left: textEl.style.left,
                    top: textEl.style.top
                }
            });
        });
        
        const projectData = JSON.stringify(project);
        localStorage.setItem('textEditorProject', projectData);
        alert('প্রজেক্ট সেভ করা হয়েছে!');
    });
    
    loadProjectBtn.addEventListener('click', function() {
        const projectData = localStorage.getItem('textEditorProject');
        if (!projectData) {
            alert('কোন সেভ করা প্রজেক্ট পাওয়া যায়নি!');
            return;
        }
        
        const project = JSON.parse(projectData);
        
        // ক্যানভাস ক্লিয়ার
        canvas.innerHTML = '';
        
        // ব্যাকগ্রাউন্ড সেট
        if (project.background.image && project.background.image !== 'none') {
            canvas.style.backgroundImage = project.background.image;
            canvas.style.backgroundColor = 'transparent';
        } else {
            canvas.style.backgroundColor = project.background.color;
            canvas.style.backgroundImage = 'none';
        }
        canvas.style.backgroundSize = project.background.size;
        
        // টেক্সট এলিমেন্ট লোড
        project.texts.forEach(textData => {
            const textElement = document.createElement('div');
            textElement.className = 'text-element';
            textElement.contentEditable = 'true';
            textElement.textContent = textData.content;
            
            // স্টাইল অ্যাপ্লাই
            for (const [property, value] of Object.entries(textData.style)) {
                textElement.style[property] = value;
            }
            
            canvas.appendChild(textElement);
            makeDraggable(textElement);
        });
        
        alert('প্রজেক্ট লোড করা হয়েছে!');
    });
    
    // টেক্সট এলিমেন্ট ড্র্যাগ করা
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            setActiveTextElement(element);
            
            // কারেন্ট মাউস পজিশন
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // নতুন পজিশন ক্যালকুলেট
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // এলিমেন্টের নতুন পজিশন সেট
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // একটিভ টেক্সট এলিমেন্ট সেট
    function setActiveTextElement(element) {
        if (activeTextElement) {
            activeTextElement.style.borderColor = 'transparent';
        }
        
        activeTextElement = element;
        activeTextElement.style.borderColor = '#3498db';
        
        // টুলবারে কারেন্ট স্টাইল আপডেট
        textColorInput.value = rgbToHex(getComputedStyle(element).color);
        fontSizeSelect.value = element.style.fontSize || '16px';
        boldBtn.style.backgroundColor = element.style.fontWeight === 'bold' ? '#3498db' : '#34495e';
        italicBtn.style.backgroundColor = element.style.fontStyle === 'italic' ? '#3498db' : '#34495e';
    }
    
    // RGB কালারকে HEX এ কনভার্ট
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#000000';
        
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return '#000000';
        
        const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
        const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
        const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`;
    }
    
    // ক্যানভাসে ক্লিক করলে একটিভ এলিমেন্ট আনসিলেক্ট
    canvas.addEventListener('click', function(e) {
        if (e.target === canvas) {
            if (activeTextElement) {
                activeTextElement.style.borderColor = 'transparent';
                activeTextElement = null;
            }
        }
    });
});