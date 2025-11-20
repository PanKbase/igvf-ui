<template>

    <div class="pkb-footer">

        <div class="menu">

            <div class="main-menu-items">

                <div

                    v-for="item in pkbMenu.highlightItems"

                    class="menu-item-wrapper"

                >

                    <a class="menu-item menu-item-main" :href="item.path">{{

                        item.label

                    }}</a>

                </div>

            </div>

            <div

                v-for="item in pkbMenu.menuItems"

                class="menu-item-wrapper"

            >

                <a class="menu-item" :href="item.path || null">{{

                    item.label

                }}</a>

                <div v-if="item.subMenuItems" class="submenu">

                    <a

                        v-for="subItem in item.subMenuItems"

                        class="submenu-item"

                        :href="subItem.path || null"

                    >

                        {{ subItem.label }}

                    </a>

                </div>

            </div>

        </div>



        <!-- Social Media Icons Section -->

        <div class="f-row align-v-center logos" style="gap: 10px">

            <a

                href="https://x.com/PanKbase"

                target="_blank"

                title="@PanKbase"

                rel="noopener noreferrer"

            >

                <img

                    style="height: 20px; width: 20px"

                    src="https://hugeampkpncms.org/sites/default/files/images/logos/external/x-black.svg"

                    alt="X (Twitter)"

                />

            </a>

            <a

                href="https://bsky.app/profile/pankbase.bsky.social"

                target="_blank"

                title="@pankbase.bsky.social"

                rel="noopener noreferrer"

            >

                <img

                    style="height: 20px; width: 20px"

                    src="https://hugeampkpncms.org/sites/default/files/images/logos/external/bluesky-black.svg"

                    alt="Bluesky"

                />

            </a>

            <a

                href="https://www.linkedin.com/groups/13199008/"

                target="_blank"

                title="LinkedIn"

                rel="noopener noreferrer"

            >

                <img

                    style="height: 20px; width: 20px"

                    src="https://hugeampkpncms.org/sites/default/files/images/logos/external/linkedin-black.svg"

                    alt="LinkedIn"

                />

            </a>

            <a

                href="https://github.com/PanKbase"

                target="_blank"

                title="GitHub"

                rel="noopener noreferrer"

            >

                <img

                    style="height: 20px; width: 20px"

                    src="https://hugeampkpncms.org/sites/default/files/images/logos/external/github-black.svg"

                    alt="GitHub"

                />

            </a>

        </div>



        <div class="f-row" style="gap: 20px">

            <a href="/">

                <img

                    style="height: 37px; width: auto"

                    src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black.svg"

                    alt="PanKbase Logo"

                />

            </a>

            <div>

                Supported by <strong>National Institutes of Health (NIH)</strong> grants

                <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong>

                <br />

                Supplemental funds from the <strong>NIH Office of Data Science Strategies</strong>

            </div>

            <a

                href="https://hirnetwork.org/"

                target="_blank"

                rel="noopener noreferrer"

            >

                <img

                    style="height: 37px; width: auto"

                    src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg"

                    alt="HIRN Logo"

                />

            </a>

        </div>

    </div>

</template>



<script>

import Vue from "vue";

import { pkbMenu } from "@/portals/PanKbase/assets/pkbMenu.js";



export default Vue.component("PkbFooter", {

    props: {},

    data() {

        return {

            pkbMenu,

        };

    },

    computed: {},

    methods: {},

});

</script>



<style scoped>

.pkb-footer {

    width: 100%;

    background: #fafafa;

    padding: 20px;

    border-top: 2px solid var(--pkb-primary-green);

    font-family: "Open Sans", sans-serif;

    display: flex;

    flex-direction: column;

    gap: 20px;

}

.f-row {

    display: flex;

    align-items: center;

}

.align-v-center {

    align-items: center;

}

.logos {

    display: flex;

    gap: 10px;

}

.menu {

    display: flex;

    font-weight: 600;

    flex-wrap: wrap;

    gap: 10px;

}

.menu-item-wrapper {

    position: relative;

    display: flex;

}

.main-menu-items {

    display: flex;

    position: relative;

    padding-right: 2px;

}

.main-menu-items:after {

    content: "";

    position: absolute;

    top: 7px;

    right: 0px;

    width: 2px;

    background-color: var(--pkb-primary-green);

    height: 50%;

}

.menu-item {

    position: relative;

    padding: 5px 10px;

    cursor: pointer;

    border-radius: 10px 10px 0 0;

    font-weight: 600;

    color: var(--pkb-black);

    border-bottom: 5px solid transparent;

}

.menu-item.menu-item-main {

    color: var(--pkb-primary-green) !important;

}

.menu-item-wrapper:hover .menu-item {

    color: var(--pkb-primary-green) !important;

    border-bottom: 5px solid var(--pkb-primary-green);

}

.menu-item-wrapper:hover > .submenu {

    display: flex;

}

.submenu {

    position: absolute;

    top: 100%;

    right: 0;

    background: var(--pkb-secondary-green);

    padding: 10px 10px 15px 15px;

    border-radius: 0 0 5px 5px;

    width: max-content;

    flex-direction: column;

    align-items: flex-end;

    gap: 5px;

    display: none;

    border-top: 2px solid var(--pkb-primary-green);

    box-shadow: inset 0 7px 5px -5px var(--pkb-primary-green);

}

.submenu-item {

    color: var(--pkb-black);

    width: -webkit-fill-available;

    text-align: right;

}

.submenu-item:hover {

    color: white !important;

    cursor: pointer;

}

a,

a:visited {

    color: black !important;

}

a:hover {

    text-decoration: none;

}

</style>
