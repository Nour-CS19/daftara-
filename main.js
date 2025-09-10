// Page load animation
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
});

// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        const spans = mobileMenu.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = mobileMenu.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Scroll to top button
const scrollTop = document.getElementById('scrollTop');

if (scrollTop) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 80) {
    if (!element) return;
    
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

setTimeout(() => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
}, 1000);

// Add floating animation to elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        element.style.animationDuration = `${4 + index}s`;
    });
}

addFloatingAnimation();

// Add click events to CTA buttons with ripple effect
document.querySelectorAll('.main-btn, .cta-btn').forEach(btn => {
    // Exclude edit/delete buttons in tables
    if (btn.closest('#medicinesTable') || btn.closest('#customersTable')) return;
    
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Re-render tables to display saved data
        renderMedicines();
        renderCustomers();
        
        // Show success message
        showMessage('generalSuccess', 'تم عرض البيانات المحفوظة بنجاح');
        
        // Redirect to registration page after a delay
        setTimeout(() => {
            window.location.href = 'registration.html';
        }, 2000); // Delay to allow message to be visible
    });
});

// Performance optimization: Lazy load images
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileMenu) {
            const spans = mobileMenu.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    if (e.target.classList.contains('main-btn') || e.target.classList.contains('cta-btn')) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Input sanitization to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Generic function to save to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error(`Error saving ${key} to localStorage:`, e);
        if (e.name === 'QuotaExceededError') {
            return { success: false, message: 'تجاوزت سعة التخزين المحلية، الرجاء حذف بعض البيانات' };
        }
        return { success: false, message: 'فشل في حفظ البيانات، حاول مرة أخرى' };
    }
}

// CRUD for Medicines with localStorage
function loadMedicines() {
    try {
        const stored = localStorage.getItem('medicines');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
        return [
            { name: 'باراسيتامول', code: 'MED001', expiry: '2026-12-31', quantity: 100 },
            { name: 'أموكسيسيلين', code: 'MED002', expiry: '2025-06-30', quantity: 50 }
        ];
    } catch (e) {
        console.error('Error loading medicines:', e);
        showMessage('medicineError', 'فشل في تحميل بيانات الأدوية، يتم استخدام البيانات الافتراضية');
        return [
            { name: 'باراسيتامول', code: 'MED001', expiry: '2026-12-31', quantity: 100 },
            { name: 'أموكسيسيلين', code: 'MED002', expiry: '2025-06-30', quantity: 50 }
        ];
    }
}

let medicines = loadMedicines();

function saveMedicines() {
    const result = saveToLocalStorage('medicines', medicines);
    if (result !== true) {
        showMessage('medicineError', result.message);
        return false;
    }
    return true;
}

function renderMedicines() {
    const tbody = document.querySelector('#medicinesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    medicines.forEach((med, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.code}</td>
            <td>${med.expiry}</td>
            <td>${med.quantity}</td>
            <td>
                <button class="main-btn" onclick="editMedicine(${index})">تعديل</button>
                <button class="delete-btn" onclick="deleteMedicine(${index})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updateAnalytics();
}

function validateMedicineForm() {
    let isValid = true;
    const medName = document.getElementById('medName').value.trim();
    const medCode = document.getElementById('medCode').value.trim();
    const medExpiry = document.getElementById('medExpiry').value;
    const medQuantity = parseInt(document.getElementById('medQuantity').value, 10);

    document.querySelectorAll('#medicineForm .error-message').forEach(el => el.style.display = 'none');
    document.getElementById('medicineError').style.display = 'none';

    if (!medName) {
        document.getElementById('medNameError').style.display = 'block';
        isValid = false;
    }

    if (!medCode) {
        document.getElementById('medCodeError').style.display = 'block';
        isValid = false;
    }

    const today = new Date().toISOString().split('T')[0];
    if (!medExpiry || medExpiry < today) {
        document.getElementById('medExpiryError').style.display = 'block';
        isValid = false;
    }

    if (isNaN(medQuantity) || medQuantity < 1) {
        document.getElementById('medQuantityError').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function editMedicine(index) {
    const med = medicines[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('medName').value = med.name;
    document.getElementById('medCode').value = med.code;
    document.getElementById('medExpiry').value = med.expiry;
    document.getElementById('medQuantity').value = med.quantity;
    document.getElementById('formTitle').textContent = 'تعديل دواء';
    document.getElementById('cancelEdit').style.display = 'inline-block';
    document.getElementById('medicineForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteMedicine(index) {
    if (confirm('هل أنت متأكد من حذف هذا الدواء؟')) {
        medicines.splice(index, 1);
        if (saveMedicines()) {
            showMessage('medicineSuccess', 'تم حذف الدواء بنجاح');
            renderMedicines();
        } else {
            showMessage('medicineError', 'فشل في حذف الدواء، حاول مرة أخرى');
        }
    }
}

function updateAnalytics() {
    const totalMedicines = medicines.length;
    const lowStock = medicines.filter(med => med.quantity < 10).length;
    const today = new Date().toISOString().split('T')[0];
    const expiredMedicines = medicines.filter(med => med.expiry < today).length;

    document.getElementById('totalMedicines').textContent = totalMedicines;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('expiredMedicines').textContent = expiredMedicines;
}

function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Message element with ID ${elementId} not found`);
        return;
    }
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

document.getElementById('medicineForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'جارٍ الحفظ...';

    if (!validateMedicineForm()) {
        submitButton.disabled = false;
        submitButton.textContent = 'حفظ';
        return;
    }

    const editIndex = document.getElementById('editIndex').value;
    const medicine = {
        name: sanitizeInput(document.getElementById('medName').value.trim()),
        code: sanitizeInput(document.getElementById('medCode').value.trim().toUpperCase()),
        expiry: document.getElementById('medExpiry').value,
        quantity: parseInt(document.getElementById('medQuantity').value, 10)
    };

    try {
        if (editIndex === '') {
            if (medicines.some(m => m.code === medicine.code)) {
                showMessage('medicineError', 'كود الدواء موجود بالفعل');
                submitButton.disabled = false;
                submitButton.textContent = 'حفظ';
                return;
            }
            medicines.push(medicine);
            showMessage('medicineSuccess', 'تم إضافة الدواء بنجاح');
        } else {
            medicines[parseInt(editIndex)] = medicine;
            showMessage('medicineSuccess', 'تم تعديل الدواء بنجاح');
            document.getElementById('editIndex').value = '';
            document.getElementById('formTitle').textContent = 'إضافة دواء جديد';
            document.getElementById('cancelEdit').style.display = 'none';
        }

        if (saveMedicines()) {
            renderMedicines();
            this.reset();
            document.querySelectorAll('#medicineForm .error-message').forEach(el => el.style.display = 'none');
            document.getElementById('medicineError').style.display = 'none';
        } else {
            throw new Error('فشل في حفظ الدواء');
        }
    } catch (error) {
        console.error('Error in medicine form submission:', error);
        showMessage('medicineError', 'فشل في حفظ الدواء، حاول مرة أخرى');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'حفظ';
    }
});

document.getElementById('cancelEdit')?.addEventListener('click', function() {
    document.getElementById('medicineForm').reset();
    document.getElementById('editIndex').value = '';
    document.getElementById('formTitle').textContent = 'إضافة دواء جديد';
    this.style.display = 'none';
    document.querySelectorAll('#medicineForm .error-message').forEach(el => el.style.display = 'none');
    document.getElementById('medicineError').style.display = 'none';
});

// CRUD for Customers with localStorage
function loadCustomers() {
    try {
        const stored = localStorage.getItem('customers');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
        return [
            { name: 'أحمد محمد', phone: '0123456789', email: 'ahmed@example.com', insurance: 'تأمين الصحة' },
            { name: 'فاطمة علي', phone: '0987654321', email: 'fatima@example.com', insurance: 'تأمين الوطنية' }
        ];
    } catch (e) {
        console.error('Error loading customers:', e);
        showMessage('customerError', 'فشل في تحميل بيانات العملاء، يتم استخدام البيانات الافتراضية');
        return [
            { name: 'أحمد محمد', phone: '0123456789', email: 'ahmed@example.com', insurance: 'تأمين الصحة' },
            { name: 'فاطمة علي', phone: '0987654321', email: 'fatima@example.com', insurance: 'تأمين الوطنية' }
        ];
    }
}

let customers = loadCustomers();

function saveCustomers() {
    const result = saveToLocalStorage('customers', customers);
    if (result !== true) {
        showMessage('customerError', result.message);
        return false;
    }
    return true;
}

function renderCustomers() {
    const tbody = document.querySelector('#customersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    customers.forEach((cust, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cust.name}</td>
            <td>${cust.phone}</td>
            <td>${cust.email}</td>
            <td>${cust.insurance || '-'}</td>
            <td>
                <button class="main-btn" onclick="editCustomer(${index})">تعديل</button>
                <button class="delete-btn" onclick="deleteCustomer(${index})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function validateCustomerForm() {
    let isValid = true;
    const custName = document.getElementById('custName').value.trim();
    const custPhone = document.getElementById('custPhone').value.trim();
    const custEmail = document.getElementById('custEmail').value.trim();
    const custInsurance = document.getElementById('custInsurance').value.trim();

    document.querySelectorAll('#customerForm .error-message').forEach(el => el.style.display = 'none');
    document.getElementById('customerError').style.display = 'none';

    if (!custName) {
        document.getElementById('custNameError').style.display = 'block';
        isValid = false;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!custPhone || !phoneRegex.test(custPhone)) {
        document.getElementById('custPhoneError').style.display = 'block';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!custEmail || !emailRegex.test(custEmail)) {
        document.getElementById('custEmailError').style.display = 'block';
        isValid = false;
    }

    if (!custInsurance) {
        document.getElementById('custInsuranceError').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function editCustomer(index) {
    const cust = customers[index];
    document.getElementById('customerEditIndex').value = index;
    document.getElementById('custName').value = cust.name;
    document.getElementById('custPhone').value = cust.phone;
    document.getElementById('custEmail').value = cust.email;
    document.getElementById('custInsurance').value = cust.insurance || '';
    document.getElementById('customerFormTitle').textContent = 'تعديل عميل';
    document.getElementById('customerCancelEdit').style.display = 'inline-block';
    document.getElementById('customerForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteCustomer(index) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        customers.splice(index, 1);
        if (saveCustomers()) {
            showMessage('customerSuccess', 'تم حذف العميل بنجاح');
            renderCustomers();
        } else {
            showMessage('customerError', 'فشل في حذف العميل، حاول مرة أخرى');
        }
    }
}

document.getElementById('customerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'جارٍ الحفظ...';

    if (!validateCustomerForm()) {
        submitButton.disabled = false;
        submitButton.textContent = 'حفظ';
        return;
    }

    const editIndex = document.getElementById('customerEditIndex').value;
    const customer = {
        name: sanitizeInput(document.getElementById('custName').value.trim()),
        phone: document.getElementById('custPhone').value.trim(),
        email: document.getElementById('custEmail').value.trim().toLowerCase(),
        insurance: sanitizeInput(document.getElementById('custInsurance').value.trim())
    };

    try {
        if (editIndex === '') {
            if (customers.some(c => c.phone === customer.phone || c.email === customer.email)) {
                showMessage('customerError', 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل');
                submitButton.disabled = false;
                submitButton.textContent = 'حفظ';
                return;
            }
            customers.push(customer);
            showMessage('customerSuccess', 'تم إضافة العميل بنجاح');
        } else {
            customers[parseInt(editIndex)] = customer;
            showMessage('customerSuccess', 'تم تعديل العميل بنجاح');
            document.getElementById('customerEditIndex').value = '';
            document.getElementById('customerFormTitle').textContent = 'إضافة عميل جديد';
            document.getElementById('customerCancelEdit').style.display = 'none';
        }

        if (saveCustomers()) {
            renderCustomers();
            this.reset();
            document.querySelectorAll('#customerForm .error-message').forEach(el => el.style.display = 'none');
            document.getElementById('customerError').style.display = 'none';
        } else {
            throw new Error('فشل في حفظ العميل');
        }
    } catch (error) {
        console.error('Error in customer form submission:', error);
        showMessage('customerError', 'فشل في حفظ العميل، حاول مرة أخرى');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'حفظ';
    }
});

document.getElementById('customerCancelEdit')?.addEventListener('click', function() {
    document.getElementById('customerForm').reset();
    document.getElementById('customerEditIndex').value = '';
    document.getElementById('customerFormTitle').textContent = 'إضافة عميل جديد';
    this.style.display = 'none';
    document.querySelectorAll('#customerForm .error-message').forEach(el => el.style.display = 'none');
    document.getElementById('customerError').style.display = 'none';
});

// Contact Form Submission
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const contactName = document.getElementById('contactName').value.trim();
    const contactEmail = document.getElementById('contactEmail').value.trim();
    const contactSubject = document.getElementById('contactSubject').value.trim();
    const contactMessage = document.getElementById('contactMessage').value.trim();

    document.querySelectorAll('#contactForm .error-message').forEach(el => el.style.display = 'none');

    let isValid = true;
    if (!contactName) {
        document.getElementById('contactNameError').style.display = 'block';
        isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !emailRegex.test(contactEmail)) {
        document.getElementById('contactEmailError').style.display = 'block';
        isValid = false;
    }
    if (!contactSubject) {
        document.getElementById('contactSubjectError').style.display = 'block';
        isValid = false;
    }
    if (!contactMessage) {
        document.getElementById('contactMessageError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        showMessage('contactSuccess', 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً');
        this.reset();
    } else {
        showMessage('contactError', 'الرجاء ملء جميع الحقول بشكل صحيح');
    }
});

// Initialize tables
renderMedicines();
renderCustomers();

// Add button styles
const style = document.createElement('style');
style.textContent = `
    .delete-btn {
        background: #dc3545;
        color: white !important;
        padding: 8px 15px;
        border-radius: 25px;
        text-decoration: none !important;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        display: inline-block;
        margin-right: 5px;
    }
    .delete-btn:hover {
        background: #c82333;
        transform: translateY(-1px);
    }
    button[type="submit"] {
        background: #007bff;
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    button[type="submit"]:disabled {
        background: #6c757d;
        cursor: not-allowed;
        opacity: 0.7;
    }
    .main-btn, .cta-btn {
        background: #007bff;
        color: white !important;
        padding: 10px 20px;
        border-radius: 25px;
        text-decoration: none !important;
        font-weight: 500;
        font-size: 1rem;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .main-btn:hover, .cta-btn:hover {
        background: #0056b3;
        transform: translateY(-1px);
    }
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
    }
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    #generalSuccess {
        background: #28a745;
        color: white;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        display: none;
        margin: 10px 0;
    }
`;
document.head.appendChild(style);