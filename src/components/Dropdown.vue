<template>
  <div class="input-dropdown" :style="{ width: width + 'px' }">
    <div
      ref="menuButtonActions"
      v-click-outside="onClickOutside"
      class="menu-button-actions w-100"
      :class="{ focus: inFocus }"
      @focusin="inFocus = true"
      @focusout="inFocus = false"
    >
      <!-- Add a label -->
      <label v-if="label" :for="`dd-${id}`">{{ label }}</label>
      <button
        :id="`dd-${id}`"
        ref="buttonNode"
        type="button"
        class="btn btn-md btn-outline-primary w-100 p-2"
        aria-haspopup="true"
        :aria-controls="`dd-${id}__menu`"
        @click="onButtonClick"
        @keydown="onButtonKeydown"
      >
        <span class="input-dropdown__selected">{{ selectedOptionLabel }}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="down"
          width="12"
          height="9"
          viewBox="0 0 255 255"
        >
          <path d="M0 64l128 127L255 64z"></path>
        </svg>
      </button>
      <ul
        :id="`dd-${id}__menu`"
        ref="menuNode"
        role="menu"
        tabindex="-1"
        :aria-labelledby="`dd-${id}`"
        :aria-activedescendant="getMenuItemId(currentMenuitem)"
        :style="{ width: width + 'px', 'z-index': 8 }"
        @keydown="onMenuKeydown"
      >
        <li
          v-for="(option, index) in options"
          :id="getMenuItemId(index)"
          :key="getMenuItemId(index)"
          role="menuitem"
          tabindex="-1"
          :data-index="index"
          :data-value="option.value"
          class="w-100"
          :class="{ focus: index == currentMenuitem }"
          @click="onMenuitemClick"
          @mouseover="onMenuitemMouseover"
        >
          {{ optionValue(option, "label") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

Vue.directive("click-outside", {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // if the click event was triggered for an element outside the target element
      if (!(el === event.target || el.contains(event.target))) {
        // trigger the event handler with event as an argument
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function (el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

export default {
  props: {
    /**
     * Array of options
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * Selected value
     */
    value: {
      type: [String, Number],
      default: "",
    },
    /**
     * Label to add
     */
    label: { type: String, default: undefined },
    /**
     * Dropdown width
     */
    width: { type: Number, default: 200 },
    /**
     * Random id is generated if none provided
     */
    id: {
      type: String,
      default: () => `dd_${Math.random().toString(12).substring(2, 8)}`,
    },
  },
  data: () => ({
    currentMenuitem: null,
    selectedOptionLabel: null,
    firstMenuitem: 0,
    firstChars: [],
    inFocus: false,
  }),
  computed: {
    lastMenuitem() {
      return this.options.length - 1;
    },
  },
  created() {
    let option;
    for (let i = 0; i < this.options.length; i++) {
      let o = this.options[i];
      if (this.optionValue(o, "value") === this.value) {
        option = o;
        this.currentMenuitem = i;
        break;
      }
    }
    if (option === undefined)
      throw Error(`Cannot initialize dropdown with value ${this.value}`);

    // Set the default
    this.selectedOptionLabel = this.optionValue(option, "label");

    // Get first characters
    for (let i = 0; i < this.options.length; i++) {
      let option = this.options[i];
      this.firstChars.push(
        this.optionValue(option, "label").trim()[0].toLowerCase()
      );
    }
  },
  methods: {
    optionValue(option, key) {
      if (typeof option === "string") {
        return option;
      }
      if (typeof option === "object") {
        return option[key];
      }
    },
    getMenuItemId(index) {
      return `menuitem-${index}`;
    },
    setFocusToMenuitem(newMenuitem) {
      this.currentMenuitem = newMenuitem;
    },

    setFocusToFirstMenuitem() {
      this.setFocusToMenuitem(this.firstMenuitem);
    },

    setFocusToLastMenuitem() {
      this.setFocusToMenuitem(this.lastMenuitem);
    },

    setFocusToPreviousMenuitem() {
      var newMenuitem;

      if (this.currentMenuitem === this.firstMenuitem) {
        newMenuitem = this.lastMenuitem;
      } else {
        newMenuitem = this.currentMenuitem - 1;
      }

      this.setFocusToMenuitem(newMenuitem);

      return newMenuitem;
    },

    setFocusToNextMenuitem() {
      var newMenuitem;

      if (this.currentMenuitem === this.lastMenuitem) {
        newMenuitem = this.firstMenuitem;
      } else {
        newMenuitem = this.currentMenuitem + 1;
      }
      this.setFocusToMenuitem(newMenuitem);

      return newMenuitem;
    },

    setFocusByFirstCharacter(char) {
      var start, index;

      if (char.length > 1) {
        return;
      }

      char = char.toLowerCase();

      // Get start index for search based on position of currentItem
      start = this.currentMenuitem + 1;
      if (start >= this.options.length) {
        start = 0;
      }

      // Check remaining slots in the menu
      index = this.firstChars.indexOf(char, start);

      // If not found in remaining slots, check from beginning
      if (index === -1) {
        index = this.firstChars.indexOf(char, 0);
      }

      // If match was found...
      if (index > -1) {
        this.setFocusToMenuitem(index);
      }
    },

    // Utilities

    getIndexFirstChars(startIndex, char) {
      for (var i = startIndex; i < this.firstChars.length; i++) {
        if (char === this.firstChars[i]) {
          return i;
        }
      }
      return -1;
    },

    // Popup menu methods

    openPopup() {
      this.$refs.menuNode.style.display = "block";
      this.$refs.buttonNode.setAttribute("aria-expanded", "true");
      this.$refs.menuNode.focus();
      this.setFocusToFirstMenuitem();
    },

    closePopup() {
      if (this.isOpen()) {
        this.$refs.buttonNode.removeAttribute("aria-expanded");
        this.$refs.menuNode.setAttribute("aria-activedescendant", "");
        this.$refs.menuNode.style.display = "none";
        this.$refs.buttonNode.focus();
      }
    },

    isOpen() {
      return this.$refs.buttonNode.getAttribute("aria-expanded") === "true";
    },

    // Menu event handlers

    onButtonKeydown(event) {
      var key = event.key,
        flag = false;

      switch (key) {
        case " ":
        case "Enter":
        case "ArrowDown":
        case "Down":
          this.openPopup();
          this.setFocusToFirstMenuitem();
          flag = true;
          break;

        case "Esc":
        case "Escape":
          this.closePopup();
          flag = true;
          break;

        case "Up":
        case "ArrowUp":
          this.openPopup();
          this.setFocusToLastMenuitem();
          flag = true;
          break;

        default:
          break;
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    onButtonClick(event) {
      if (this.isOpen()) {
        this.closePopup();
      } else {
        this.openPopup();
      }
      event.stopPropagation();
      event.preventDefault();
    },

    onMenuKeydown(event) {
      var key = event.key,
        flag = false;

      function isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      }

      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.shiftKey) {
        if (isPrintableCharacter(key)) {
          this.setFocusByFirstCharacter(key);
          flag = true;
        }

        if (event.key === "Tab") {
          this.closePopup();
          flag = true;
        }
      } else {
        switch (key) {
          case " ":
          case "Enter":
            this.closePopup();
            this.performMenuAction();
            flag = true;
            break;

          case "Esc":
          case "Escape":
            this.closePopup();
            flag = true;
            break;

          case "Up":
          case "ArrowUp":
            this.setFocusToPreviousMenuitem();
            flag = true;
            break;

          case "ArrowDown":
          case "Down":
            this.setFocusToNextMenuitem();
            flag = true;
            break;

          case "Home":
          case "PageUp":
            this.setFocusToFirstMenuitem();
            flag = true;
            break;

          case "End":
          case "PageDown":
            this.setFocusToLastMenuitem();
            flag = true;
            break;

          case "Tab":
            this.closePopup();
            break;

          default:
            if (isPrintableCharacter(key)) {
              this.setFocusByFirstCharacter(key);
              flag = true;
            }
            break;
        }
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    onMenuitemMouseover(event) {
      var tgt = event.currentTarget;
      let index = parseInt(tgt.getAttribute("data-index"));
      this.setFocusToMenuitem(index);
    },

    onMenuitemClick() {
      this.closePopup();
      this.performMenuAction();
    },

    onClickOutside(event) {
      if (!this.$refs.menuButtonActions.contains(event.target)) {
        if (this.isOpen()) {
          this.closePopup();
        }
      }
    },

    performMenuAction() {
      // Get the current option
      let option = this.options[this.currentMenuitem];

      // Set the current label
      this.selectedOptionLabel = this.optionValue(option, "label");

      // Emit the current value
      this.$emit("input", this.optionValue(option, "value"));
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0rem !important;
  font-size: 0.9rem;
}
.input-dropdown {
  z-index: 8;
}
.menu-button-actions {
  margin: 0;
  padding: 0;
}

.menu-button-actions [role="menu"] {
  display: none;
  position: absolute;
  margin: 0;
  padding: 7px 4px;
  border: 0.5px solid #222;
  border-radius: 5px;
  background-color: #fff;
}

.menu-button-actions [role="menuitem"] {
  margin: 0;
  padding: 6px;
  display: block;
  width: 4em;
  background-color: #fff;
  color: black;
  border-radius: 5px;
}

.menu-button-actions button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-button-actions button svg.down {
  padding-left: 0.125em;
  fill: currentcolor;
  stroke: currentcolor;
}

.menu-button-actions button[aria-expanded="true"] svg.down {
  transform: rotate(180deg);
}

/* focus styling */

.menu-button-actions [role="menuitem"].focus,
.menu-button-actions [role="menuitem"]:focus {
  padding: 4px;
  border: 2px solid #2176d2;
  background: #2176d2;
  color: #fff;
  outline: none;
  margin: 0;
}
</style>