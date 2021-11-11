TASKS = build serve

.PHONY: $(TASKS)

$(TASKS):
	export VUE_APP_SODA_MODE=$(mode); yarn run $@ 