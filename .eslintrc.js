
module.exports = {
    extends: [
        // add more generic rulesets here, such as:
        'plugin:vue/recommended',
        "prettier"
    ],
    rules: {
        "vue/valid-v-slot": [
            "error",
            {
                "allowModifiers": true
            }
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
    }
}