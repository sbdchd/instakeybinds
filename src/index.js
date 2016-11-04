/* global window document require */
// style.css is auto injected with the help of webpack
require('./style.css');
// webpack returns html from pug
const modal_html = require('./modal.pug');

const navigation = () => {

    // add keybinds modal
    const m = document.createElement('div');
    m.innerHTML = modal_html;
    document.querySelector('body').appendChild(m);

    // make the exit button work
    document.querySelector('#keybinds_modal > .modal_close')
        .addEventListener('click', () => {
            document.querySelector('#keybinds_modal')
                .classList.remove('active');
    }, false);

    const items    = () =>  document.querySelectorAll('.article_item');
    let item_index = 0;
    const cur_item = () => items()[item_index];

    let color_index = 0;
    // figure out the current color mode
    [...document.querySelectorAll('.js_swatch.swatch')]
        .forEach((el, index) => {
            if (el.classList.contains('active')) {
                color_index = index;
            }
        });

    const in_view = el => {
        const top = el.getBoundingClientRect().top;
        const bottom = el.getBoundingClientRect().bottom;
        return top >= 0 && bottom <= window.innerHeight;
    };

    const scroll_into_view = el => {
        const nav_bar_height = document.querySelector('#page_header').offsetHeight;
        if (!in_view(el)) {
            el.scrollIntoView();
            window.scroll(0, window.scrollY - nav_bar_height);
        }
    };

    // necessary for some flukes where highlights won't be removed
    const remove_all_highlights = () => [...document.querySelectorAll('article.highlight')]
                                            .forEach(x => x.classList.remove('highlight'));

    // init
    cur_item().classList.add('highlight');
    scroll_into_view(cur_item());

    return {
        up: () => {
            if (item_index > 0) {
                remove_all_highlights();
                item_index -= 1;
                cur_item().classList.add('highlight');
                scroll_into_view(cur_item());
            }
        },
        down: () => {
            const not_last = item_index < items().length - 1;
            if (not_last) {
                remove_all_highlights();
                item_index += 1;
                cur_item().classList.add('highlight');
                scroll_into_view(cur_item());
            }
        },
        open_new_tab: () => {
            const url = cur_item().querySelector('a.js_domain_linkout').href;
            window.open(url, '_blank');
        },
        switch_theme: () => {
            // a hack to allow for the color mode to be changed
            document.querySelector('[data-target="#settings_menu"]').click();

            const light = document.querySelectorAll('[data-color-mode="lightmode"]')[1];
            const sepia = document.querySelectorAll('[data-color-mode="sepiamode"]')[1];
            const storm = document.querySelectorAll('[data-color-mode="stormmode"]')[1];
            const dark  = document.querySelectorAll('[data-color-mode="darkmode"]')[1];

            // ensure the color_index doesn't go above its logical bounds
            color_index += 1;
            color_index %= 4;

            const l = [light, sepia, storm, dark];
            l[color_index].click();

            document.querySelector('[data-target="#settings_menu"]').click();
        },
        archive_restore: () => {
            cur_item().querySelector("[title='Archive'], [title='Restore']").click();
            // due to a delay in the archive & restore animation, the following
            // index increment and decrement is required
            item_index += 1;
            cur_item().classList.add('highlight');
            item_index -= 1;
        },
        delete:          () => cur_item().querySelector("[title='Permanently Delete']").click(),
        edit:            () => cur_item().querySelector('.js_bookmark_edit').click(),
        help:            () => document.querySelector('#keybinds_modal').classList.toggle('active'),
        like:            () => cur_item().querySelector('a.star_toggle').click(),
        open_instapaper: () => cur_item().querySelector('.article_title').click(),
        open_original:   () => cur_item().querySelector('a.js_domain_linkout').click(),
        search:          () => document.querySelector('#search_box a').click(),
        select:          () => cur_item().click(),
        share:           () => cur_item().querySelector('.js_popover').click()
    };
};

const a = 65;
const d = 68;
const e = 69;
const j = 74;
const k = 75;
const l = 76;
const n = 78;
const o = 79;
const s = 83;
const t = 84;
const x = 88;

const comma = 188;
const enter = 13;
const forward_slash = 191;

const nav = navigation();

document.addEventListener('keydown', ev => {
    ev.preventDefault;

    // don't enable keybinds when input sections like the search bar, add url
    // modal, etc. are enabled
    if (document.activeElement.tagName.toLowerCase() !== 'body') {
        return;
    }

    const is_key = k => ev.keyCode === k;

    // shift + <any_key> doesn't work because clicking + shift results in the
    // page being opened in a new tab
    if (is_key(k)) {
        nav.up();
    } else if (is_key(j)) {
        nav.down();
    } else if (is_key(o)) {
        nav.open_original();
    } else if (is_key(x)) {
        nav.select();
    } else if (is_key(d)) {
        nav.delete();
    } else if (is_key(a)) {
        nav.archive_restore();
    } else if (is_key(s)) {
        nav.share();
    } else if (is_key(e)) {
        nav.edit();
    } else if (is_key(l)) {
        nav.like();
    } else if (is_key(enter)) {
        nav.open_instapaper();
    } else if (is_key(forward_slash)) {
        nav.search();
    } else if (is_key(comma)) {
        nav.help();
    } else if (is_key(n)) {
        nav.open_new_tab();
    } else if (is_key(t)) {
        nav.switch_theme();
    }
}, false);
