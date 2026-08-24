(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const LANG = (document.documentElement.lang || 'bg').toLowerCase().startsWith('en') ? 'en' : 'bg';
  const t = (bg, en) => LANG === 'en' ? en : bg;
  const locale = LANG === 'en' ? 'en-GB' : 'bg-BG';
  const nightWord = (n) => LANG === 'en' ? (n === 1 ? 'night' : 'nights') : 'нощувки';

  // Hero image rotation
  const heroSlides = $$('.hero-slide');
  const heroDots = $$('.hero-slide-dots span');
  let heroIndex = 0;
  const showHeroSlide = (index) => {
    if (!heroSlides.length) return;
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
    heroDots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
  };
  if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => showHeroSlide(heroIndex + 1), 5200);
  }
  showHeroSlide(0);

const handleHeaderState = () => {
  document.body.classList.toggle('scrolled', window.scrollY > 18);
};
handleHeaderState();
window.addEventListener('scroll', handleHeaderState, { passive: true });

  const progress = $('.scroll-progress span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 4) * 55, 165)}ms`;
    observer.observe(el);
  });

  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

  const houseData = {
    one: {
      image: 'exterior-close.webp',
      alt: t('Една A-frame къща WOODRA', 'One WOODRA A-Frame house'),
      chip: 'ONE HOUSE',
      eyebrow: t('ОПЦИЯ ЗА ПО-МАЛКА КОМПАНИЯ', 'OPTION FOR A SMALLER GROUP'),
      title: t('Една A-frame къща.<br>Същият WOODRA ритъм.', 'One A-Frame house.<br>The same WOODRA feeling.'),
      description: t('Три спални, един разтегателен диван, две бани и механа. Вариант за по-малка компания, която иска да преживее WOODRA в по-компактен формат.', 'Three bedrooms, one sofa bed, two bathrooms and access to the traditional dining room. An option for a smaller group looking for the WOODRA experience in a more compact format.'),
      specs: LANG === 'en' ? [['3','bedrooms'],['1','sofa bed'],['2','bathrooms'],['1','traditional dining room']] : [['3','спални'],['1','разтегателен диван'],['2','бани'],['1','механа']]
    },
    both: {
      image: 'houses-pool.webp',
      alt: t('Двете A-frame къщи WOODRA', 'The two WOODRA A-Frame houses'),
      chip: 'TWO HOUSES',
      eyebrow: t('ЦЕЛИЯТ WOODRA Е СЪЗДАДЕН ЗА ВАС.', 'ALL OF WOODRA WAS CREATED FOR YOU.'),
      title: t('Вашата компания.<br>Вашето преживяване.', 'Your people.<br>Your experience.'),
      description: t('Шест спални, два разтегателни дивана, четири бани, панорамна тераса и една механа. Повече пространство, повече време заедно.', 'Six bedrooms, two sofa beds, four bathrooms, a panoramic terrace and one traditional dining room. More space, more time together.'),
      specs: LANG === 'en'
        ? [['6','bedrooms'],['2','sofa beds'],['4','bathrooms'],['1','traditional dining room'],['16','max. guests'],['Panoramic terrace with a view of Kom Peak','']]
        : [['6','спални'],['2','разтегателни дивана'],['4','бани'],['1','механа'],['16','макс. гости'],['Панорамна тераса с гледка към връх Ком','']]
    }
  };

  const houseImage = $('#house-image');
  const houseChip = $('#house-chip');
  const houseEyebrow = $('#house-eyebrow');
  const houseTitle = $('#house-title');
  const houseDescription = $('#house-description');
  const houseSpecs = $('#house-specs');
  const houseChoice = $('#house-choice');

  $$('.house-switch button').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.house;
      const data = houseData[key];
      $$('.house-switch button').forEach(b => {
        const active = b === button;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      houseImage.style.opacity = '0';
      setTimeout(() => {
        houseImage.src = data.image;
        houseImage.alt = data.alt;
        houseChip.textContent = data.chip;
        houseEyebrow.textContent = data.eyebrow;
        houseTitle.innerHTML = data.title;
        houseDescription.textContent = data.description;
        houseSpecs.innerHTML = data.specs.map(([num,label], i) => { const wide = data.specs.length > 4 && i === data.specs.length - 1; return `<div${wide ? ' class="spec-wide terrace-spec"' : ''}><strong>${num}</strong>${label ? `<span>${label}</span>` : ''}</div>`; }).join('');
        houseImage.style.opacity = '1';
      }, 180);
      if (houseChoice) houseChoice.value = key === 'one' ? 'Една къща' : 'Двете къщи';
    });
  });

  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox img');
  $$('[data-lightbox]').forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.lightbox;
      lightbox.showModal();
    });
  });
  $('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });


  const config = window.WOODRA_CONFIG || {};
  const MIN_NIGHTS = Number(config.minNights || 1);
  const SINGLE_HOUSE_MAX = Number(config.singleHouseMaxGuests || 8);
  const MONTHS_AHEAD = Number(config.availabilityMonthsAhead || 18);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isoDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  const parseISO = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const addDays = (date, days) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  };
  const addMonths = (date, months) => new Date(date.getFullYear(), date.getMonth() + months, 1);
  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getNights = (start, end) => {
    const s = typeof start === 'string' ? parseISO(start) : start;
    const e = typeof end === 'string' ? parseISO(end) : end;
    if (!s || !e) return 0;
    return Math.round((e - s) / 86400000);
  };
  const bgDate = (value) => {
    const date = typeof value === 'string' ? parseISO(value) : value;
    if (!date) return '';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
  };
  const bgMonth = (date) => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);

  const arrival = $('#arrival');
  const departure = $('#departure');
  const quickArrival = $('#quick-arrival');
  const quickDeparture = $('#quick-departure');
  const nightCount = $('#night-count');
  const bookingSelectionTitle = $('#booking-selection-title');
  const calendarRoot = $('#booking-calendar');
  const calendarStatus = $('#calendar-status');
  const calendarRangeTitle = $('#calendar-range-title');
  const calendarLoading = $('#calendar-loading');
  const form = $('#booking-form');
  const status = $('#form-status');
  const submitButton = $('.submit-button', form);
  const successCard = $('#booking-success');
  const successCopy = $('#booking-success-copy');
  const bookingReference = $('#booking-reference');

  const state = {
    viewMonth: startOfMonth(today),
    selectedStart: null,
    selectedEnd: null,
    houseMode: 'both',
    house1Busy: new Set(),
    house2Busy: new Set(),
    liveAvailability: false,
    loading: false,
    pendingNonce: '',
    submitTimer: null
  };

  [arrival, quickArrival].forEach(el => { if (el) el.min = isoDate(today); });
  [departure, quickDeparture].forEach(el => { if (el) el.min = isoDate(addDays(today, MIN_NIGHTS)); });

  function setLoading(isLoading) {
    state.loading = isLoading;
    if (calendarLoading) calendarLoading.hidden = !isLoading;
    if (calendarRoot) calendarRoot.classList.toggle('is-loading', isLoading);
  }

  function isNightFreeForHouse(date, houseNumber) {
    const key = isoDate(date);
    return houseNumber === 1 ? !state.house1Busy.has(key) : !state.house2Busy.has(key);
  }

  function isRangeAvailable(start, end, mode = state.houseMode) {
    if (!start || !end || end <= start) return false;
    const nights = [];
    for (let d = new Date(start); d < end; d = addDays(d, 1)) nights.push(new Date(d));
    const h1 = nights.every(d => isNightFreeForHouse(d, 1));
    const h2 = nights.every(d => isNightFreeForHouse(d, 2));
    return mode === 'both' ? (h1 && h2) : (h1 || h2);
  }

  function freeHouseCount(date) {
    return Number(isNightFreeForHouse(date, 1)) + Number(isNightFreeForHouse(date, 2));
  }

  function modeNightAvailable(date) {
    const free = freeHouseCount(date);
    return state.houseMode === 'both' ? free === 2 : free >= 1;
  }

  function syncDepartureMin(arrivalEl, departureEl) {
    if (!arrivalEl?.value || !departureEl) return;
    const start = parseISO(arrivalEl.value);
    const min = addDays(start, MIN_NIGHTS);
    departureEl.min = isoDate(min);
    if (!departureEl.value || parseISO(departureEl.value) < min) departureEl.value = isoDate(min);
  }

  function updateNightCount() {
    const nights = getNights(arrival?.value, departure?.value);
    if (nightCount) {
      if (!nights) nightCount.textContent = t(`Изберете период · минимум ${MIN_NIGHTS} нощувки`, `Choose a period · minimum ${MIN_NIGHTS} nights`);
      else if (nights < MIN_NIGHTS) nightCount.textContent = t(`Минималният престой е ${MIN_NIGHTS} нощувки`, `The minimum stay is ${MIN_NIGHTS} nights`);
      else nightCount.textContent = `${nights} ${nightWord(nights)} · ${bgDate(arrival.value)} → ${bgDate(departure.value)}`;
    }
    if (bookingSelectionTitle) {
      bookingSelectionTitle.textContent = nights >= MIN_NIGHTS
        ? `${bgDate(arrival.value)} → ${bgDate(departure.value)} · ${nights} ${nightWord(nights)}`
        : t('Изберете дати от календара', 'Choose dates from the calendar');
    }
  }

  function setSelectedRange(start, end = null, { syncInputs = true } = {}) {
    state.selectedStart = start ? new Date(start) : null;
    state.selectedEnd = end ? new Date(end) : null;
    if (syncInputs) {
      if (arrival) arrival.value = state.selectedStart ? isoDate(state.selectedStart) : '';
      if (departure) departure.value = state.selectedEnd ? isoDate(state.selectedEnd) : '';
      if (state.selectedStart && departure) departure.min = isoDate(addDays(state.selectedStart, MIN_NIGHTS));
    }
    updateNightCount();
    renderCalendar();
  }

  function updateCalendarStatus(message, kind = '') {
    if (!calendarStatus) return;
    calendarStatus.textContent = message;
    calendarStatus.className = `calendar-status${kind ? ` ${kind}` : ''}`;
  }

  function selectCalendarDate(date) {
    if (date < today) return;

    if (!state.selectedStart || state.selectedEnd) {
      if (!modeNightAvailable(date)) {
        updateCalendarStatus(t('Тази дата е заета. Изберете друга начална дата.', 'This date is unavailable. Choose another arrival date.'), 'error');
        return;
      }
      setSelectedRange(date, null);
      updateCalendarStatus(t(`Настаняване: ${bgDate(date)}. Сега изберете освобождаване, минимум ${MIN_NIGHTS} нощувки.`, `Arrival: ${bgDate(date)}. Now choose departure, minimum ${MIN_NIGHTS} nights.`));
      return;
    }

    if (date <= state.selectedStart) {
      if (!modeNightAvailable(date)) {
        updateCalendarStatus(t('Тази дата е заета. Изберете друга начална дата.', 'This date is unavailable. Choose another arrival date.'), 'error');
        return;
      }
      setSelectedRange(date, null);
      updateCalendarStatus(t(`Нова начална дата: ${bgDate(date)}. Изберете освобождаване.`, `New arrival date: ${bgDate(date)}. Choose departure.`));
      return;
    }

    const nights = getNights(state.selectedStart, date);
    if (nights < MIN_NIGHTS) {
      updateCalendarStatus(t(`Минимум ${MIN_NIGHTS} нощувки. Изберете по-късна дата за освобождаване.`, `Minimum ${MIN_NIGHTS} nights. Choose a later departure date.`), 'error');
      return;
    }

    if (!isRangeAvailable(state.selectedStart, date)) {
      updateCalendarStatus(t('В този период няма една и съща свободна къща за целия престой. Опитайте по-кратък или друг период.', 'There is no single house available for this entire stay. Try a shorter or different period.'), 'error');
      return;
    }

    setSelectedRange(state.selectedStart, date);
    updateCalendarStatus(t(`${nights} нощувки · ${bgDate(state.selectedStart)} → ${bgDate(date)} · периодът е свободен`, `${nights} ${nightWord(nights)} · ${bgDate(state.selectedStart)} → ${bgDate(date)} · available`), 'success');
  }

  function renderMonth(monthDate) {
    const month = document.createElement('section');
    month.className = 'calendar-month';
    const title = document.createElement('div');
    title.className = 'calendar-month-title';
    title.innerHTML = `<strong>${bgMonth(monthDate)}</strong><span>${state.houseMode === 'both' ? t('2 КЪЩИ','2 HOUSES') : t('1 КЪЩА','1 HOUSE')}</span>`;
    month.appendChild(title);

    const weekdays = document.createElement('div');
    weekdays.className = 'calendar-weekdays';
    (LANG === 'en' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Пн','Вт','Ср','Чт','Пт','Сб','Нд']).forEach(day => {
      const el = document.createElement('span');
      el.textContent = day;
      weekdays.appendChild(el);
    });
    month.appendChild(weekdays);

    const grid = document.createElement('div');
    grid.className = 'calendar-days';
    const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const firstWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++) {
      const blank = document.createElement('span');
      blank.className = 'calendar-blank';
      grid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const key = isoDate(date);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'calendar-day';
      button.dataset.date = key;
      button.innerHTML = `<span class="day-number">${day}</span><i class="day-state"></i>`;

      const past = date < today;
      const freeCount = freeHouseCount(date);
      const modeAvailable = modeNightAvailable(date);
      let validCheckout = false;
      if (state.selectedStart && !state.selectedEnd && date > state.selectedStart) {
        const nights = getNights(state.selectedStart, date);
        validCheckout = nights >= MIN_NIGHTS && isRangeAvailable(state.selectedStart, date);
      }

      if (past) {
        button.classList.add('past');
        button.disabled = true;
      } else if (!modeAvailable) {
        button.classList.add('busy');
        if (!validCheckout) button.disabled = true;
      } else if (state.houseMode === 'one' && freeCount === 1) {
        button.classList.add('limited');
      } else {
        button.classList.add('free');
      }

      if (validCheckout && !modeAvailable) button.classList.add('checkout-only');

      if (state.selectedStart && key === isoDate(state.selectedStart)) button.classList.add('range-start');
      if (state.selectedEnd && key === isoDate(state.selectedEnd)) button.classList.add('range-end');
      if (state.selectedStart && state.selectedEnd && date > state.selectedStart && date < state.selectedEnd) button.classList.add('in-range');
      if (key === isoDate(today)) button.classList.add('today');

      const availabilityLabel = past
        ? t('минала дата','past date')
        : (state.houseMode === 'one'
          ? LANG === 'en' ? `${freeCount} houses available` : `${freeCount} свободни къщи`
          : (freeCount === 2 ? t('двете къщи са свободни','both houses are available') : t('заето','unavailable')));
      button.setAttribute('aria-label', `${day} ${bgMonth(monthDate)}, ${availabilityLabel}`);
      button.addEventListener('click', () => selectCalendarDate(date));
      grid.appendChild(button);
    }

    month.appendChild(grid);
    return month;
  }

  function renderCalendar() {
    if (!calendarRoot) return;
    calendarRoot.innerHTML = '';
    const second = addMonths(state.viewMonth, 1);
    calendarRoot.appendChild(renderMonth(state.viewMonth));
    calendarRoot.appendChild(renderMonth(second));
    if (calendarRangeTitle) calendarRangeTitle.textContent = `${bgMonth(state.viewMonth)} · ${bgMonth(second)}`;
    $('#calendar-prev')?.toggleAttribute('disabled', state.viewMonth <= startOfMonth(today));
  }

  function availabilityWindow() {
    const from = startOfMonth(state.viewMonth);
    const to = addMonths(from, 2);
    return { from, to };
  }

  function jsonp(url, timeout = 12000) {
    return new Promise((resolve, reject) => {
      const callback = `woodraAvailability_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      let timer;

      const cleanup = () => {
        clearTimeout(timer);
        delete window[callback];
        script.remove();
      };

      window[callback] = (payload) => {
        cleanup();
        resolve(payload);
      };

      timer = setTimeout(() => {
        cleanup();
        reject(new Error('Availability timeout'));
      }, timeout);

      script.onerror = () => {
        cleanup();
        reject(new Error('Availability request failed'));
      };

      const separator = url.includes('?') ? '&' : '?';
      script.src = `${url}${separator}prefix=${encodeURIComponent(callback)}`;
      document.head.appendChild(script);
    });
  }

  async function loadAvailability() {
    const endpoint = String(config.bookingEndpoint || '').trim();
    if (!endpoint) {
      state.liveAvailability = false;
      state.house1Busy = new Set();
      state.house2Busy = new Set();
      renderCalendar();
      updateCalendarStatus(t('Изберете начална дата. Онлайн резервациите ще бъдат активирани скоро.', 'Choose an arrival date. Online booking will be activated soon.'));
      return;
    }

    const { from, to } = availabilityWindow();
    setLoading(true);
    try {
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${endpoint}${separator}action=availability&from=${isoDate(from)}&to=${isoDate(to)}`;
      const data = await jsonp(url);
      if (!data?.ok) throw new Error(data?.message || 'Availability error');
      state.house1Busy = new Set(data.house1Busy || []);
      state.house2Busy = new Set(data.house2Busy || []);
      state.liveAvailability = true;
      renderCalendar();

      if (state.selectedStart && state.selectedEnd && !isRangeAvailable(state.selectedStart, state.selectedEnd)) {
        setSelectedRange(null, null);
        updateCalendarStatus(t('Избраният период вече не е свободен. Моля, изберете нови дати.', 'The selected period is no longer available. Please choose new dates.'), 'error');
      } else {
        updateCalendarStatus(state.selectedStart
          ? t(`Настаняване: ${bgDate(state.selectedStart)}. Изберете освобождаване.`, `Arrival: ${bgDate(state.selectedStart)}. Choose departure.`)
          : t('Свободните дати са актуални.', 'Availability is up to date.'), 'success');
      }
    } catch (error) {
      state.liveAvailability = false;
      renderCalendar();
      updateCalendarStatus(t('В момента не успяваме да обновим календара. Опитайте отново след малко.', 'We cannot update the calendar right now. Please try again shortly.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  function setHouseMode(mode, { syncSelect = true, clearInvalid = true } = {}) {
    state.houseMode = mode === 'both' ? 'both' : 'one';
    $$('.booking-house-toggle button').forEach(button => {
      const active = button.dataset.bookingHouse === state.houseMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    if (syncSelect && houseChoice) houseChoice.value = state.houseMode === 'both' ? 'Двете къщи' : 'Една къща';

    if (clearInvalid && state.selectedStart && state.selectedEnd && !isRangeAvailable(state.selectedStart, state.selectedEnd)) {
      setSelectedRange(state.selectedStart, null);
      updateCalendarStatus(t('Сменихте варианта. Изберете нова дата за освобождаване.', 'You changed the accommodation option. Choose a new departure date.'));
    } else {
      renderCalendar();
    }
  }

  $$('.booking-house-toggle button').forEach(button => {
    button.addEventListener('click', () => setHouseMode(button.dataset.bookingHouse));
  });

  houseChoice?.addEventListener('change', () => {
    setHouseMode(houseChoice.value === 'Двете къщи' ? 'both' : 'one', { syncSelect: false });
  });

  $('#calendar-prev')?.addEventListener('click', () => {
    const previous = addMonths(state.viewMonth, -1);
    if (previous < startOfMonth(today)) return;
    state.viewMonth = previous;
    renderCalendar();
    loadAvailability();
  });

  $('#calendar-next')?.addEventListener('click', () => {
    const maxMonth = addMonths(startOfMonth(today), MONTHS_AHEAD);
    const next = addMonths(state.viewMonth, 1);
    if (next > maxMonth) {
      updateCalendarStatus(t(`Календарът показва до ${MONTHS_AHEAD} месеца напред.`, `The calendar shows up to ${MONTHS_AHEAD} months ahead.`));
      return;
    }
    state.viewMonth = next;
    renderCalendar();
    loadAvailability();
  });

  arrival?.addEventListener('change', () => {
    if (!arrival.value) return;
    syncDepartureMin(arrival, departure);
    const start = parseISO(arrival.value);
    const end = departure.value ? parseISO(departure.value) : null;
    if (end && getNights(start, end) >= MIN_NIGHTS && isRangeAvailable(start, end)) setSelectedRange(start, end, { syncInputs: false });
    else setSelectedRange(start, null, { syncInputs: false });
  });

  departure?.addEventListener('change', () => {
    if (!arrival.value || !departure.value) return;
    const start = parseISO(arrival.value);
    const end = parseISO(departure.value);
    const nights = getNights(start, end);
    if (nights < MIN_NIGHTS) {
      updateCalendarStatus(t(`Минимум ${MIN_NIGHTS} нощувки.`, `Minimum ${MIN_NIGHTS} nights.`), 'error');
      return;
    }
    if (!isRangeAvailable(start, end)) {
      updateCalendarStatus(t('Избраният период не е свободен за този вариант.', 'The selected period is not available for this option.'), 'error');
      return;
    }
    setSelectedRange(start, end, { syncInputs: false });
    updateCalendarStatus(t(`${nights} нощувки · периодът е свободен`, `${nights} ${nightWord(nights)} · available`), 'success');
  });

  quickArrival?.addEventListener('change', () => syncDepartureMin(quickArrival, quickDeparture));

  $('#quick-check')?.addEventListener('click', () => {
    syncDepartureMin(quickArrival, quickDeparture);
    const quickGuests = $('#quick-guests');
    const guests = $('#guests');
    if (quickGuests && guests) guests.value = quickGuests.value === '11' ? '11+' : quickGuests.value;

    const guestCount = quickGuests?.value === '11' ? 11 : Number(quickGuests?.value || 2);
    if (guestCount > SINGLE_HOUSE_MAX) setHouseMode('both');

    if (quickArrival?.value) {
      const start = parseISO(quickArrival.value);
      state.viewMonth = startOfMonth(start);
      const end = quickDeparture?.value ? parseISO(quickDeparture.value) : null;
      if (end && getNights(start, end) >= MIN_NIGHTS) setSelectedRange(start, end);
      else setSelectedRange(start, null);
      loadAvailability();
    }
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  });

  $('#guests')?.addEventListener('change', (e) => {
    const count = e.target.value === '11+' ? 11 : Number(e.target.value);
    if (count > SINGLE_HOUSE_MAX) setHouseMode('both');
  });

  $$('.house-switch button').forEach(button => {
    button.addEventListener('click', () => {
      setHouseMode(button.dataset.house === 'both' ? 'both' : 'one');
    });
  });


const navSections = ['hero','intro','houses','amenities','gallery','around','location','rules','booking']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const prevSectionButton = $('#section-prev');
const nextSectionButton = $('#section-next');
let currentSectionIndex = 0;

function updateFloatingNav() {
  if (!navSections.length) return;
  const threshold = window.innerHeight * 0.28;
  let activeIndex = 0;
  navSections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= threshold) activeIndex = index;
  });
  currentSectionIndex = activeIndex;
  if (prevSectionButton) prevSectionButton.disabled = currentSectionIndex === 0;
  if (nextSectionButton) nextSectionButton.disabled = currentSectionIndex === navSections.length - 1;
}

prevSectionButton?.addEventListener('click', () => {
  if (currentSectionIndex <= 0) return;
  navSections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
});

nextSectionButton?.addEventListener('click', () => {
  if (currentSectionIndex >= navSections.length - 1) return;
  navSections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
});

updateFloatingNav();
window.addEventListener('scroll', updateFloatingNav, { passive: true });
window.addEventListener('resize', updateFloatingNav);

  function createNonce() {
    if (window.crypto?.getRandomValues) {
      const bytes = new Uint32Array(4);
      window.crypto.getRandomValues(bytes);
      return [...bytes].map(v => v.toString(16)).join('');
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function clearSubmitState() {
    clearTimeout(state.submitTimer);
    state.submitTimer = null;
    state.pendingNonce = '';
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = t('Резервирай <span>↗</span>', 'Book now <span>↗</span>');
    }
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || data.source !== 'woodra-booking' || !state.pendingNonce || data.clientNonce !== state.pendingNonce) return;

    clearSubmitState();

    if (!data.ok) {
      status.textContent = data.message || t('Не успяхме да направим резервацията. Опитайте отново.', 'We could not complete the booking. Please try again.');
      status.className = 'form-status error';
      if (data.code === 'UNAVAILABLE') loadAvailability();
      return;
    }

    status.textContent = '';
    status.className = 'form-status success';
    if (successCard) successCard.hidden = false;
    if (successCopy) successCopy.textContent = `${data.dates || ''} · ${LANG === 'en' ? (data.houseLabel === 'Двете къщи' ? 'Both houses' : data.houseLabel === 'Една къща' ? 'One house' : (data.houseLabel || '')) : (data.houseLabel || '')}. ${t('Проверете имейла си за стъпките за депозит.', 'Check your email for the deposit instructions.')}`;
    if (bookingReference) bookingReference.textContent = `№ ${data.reference || ''}`;
    form.reset();
    setHouseMode('both');
    setSelectedRange(null, null);
    loadAvailability();
    successCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-status';
    if (successCard) successCard.hidden = true;

    const endpoint = String(config.bookingEndpoint || '').trim();
    if (!endpoint) {
      status.textContent = t('Онлайн резервациите се активират в момента. Моля, опитайте отново скоро.', 'Online booking is being activated. Please try again soon.');
      status.classList.add('error');
      return;
    }

    const nights = getNights(arrival.value, departure.value);
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = t('Моля, попълнете задължителните полета.', 'Please complete the required fields.');
      status.classList.add('error');
      return;
    }
    if (nights < MIN_NIGHTS) {
      status.textContent = t(`Резервацията трябва да бъде за минимум ${MIN_NIGHTS} нощувки.`, `The reservation must be for at least ${MIN_NIGHTS} nights.`);
      status.classList.add('error');
      return;
    }
    if (!state.liveAvailability) {
      status.textContent = t('Не успяваме да потвърдим свободните дати в момента. Обновете календара и опитайте пак.', 'We cannot confirm availability right now. Refresh the calendar and try again.');
      status.classList.add('error');
      loadAvailability();
      return;
    }

    const start = parseISO(arrival.value);
    const end = parseISO(departure.value);
    if (!isRangeAvailable(start, end)) {
      status.textContent = t('Този период току-що е зает или не е свободен за избрания вариант. Изберете други дати.', 'This period has just been booked or is unavailable for the selected option. Choose different dates.');
      status.classList.add('error');
      loadAvailability();
      return;
    }

    state.pendingNonce = createNonce();
    $('#client-nonce').value = state.pendingNonce;
    form.action = endpoint;
    form.method = 'post';
    form.target = 'booking-response-frame';

    submitButton.disabled = true;
    submitButton.textContent = t('Резервираме…', 'Booking…');
    status.textContent = t('Проверяваме датите още веднъж и блокираме периода…', 'Checking the dates one more time and holding the period…');

    state.submitTimer = setTimeout(() => {
      if (!state.pendingNonce) return;
      clearSubmitState();
      status.textContent = t('Отговорът се забави. Проверете имейла си преди да изпратите отново.', 'The response is taking longer than expected. Check your email before submitting again.');
      status.className = 'form-status error';
    }, 25000);

    HTMLFormElement.prototype.submit.call(form);
  });

  renderCalendar();
  updateNightCount();
  loadAvailability();
})();


window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.classList.add("reduced-motion");
