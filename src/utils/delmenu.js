function deleteMenu(structure) {
    for (let i = 0; i < structure.length; i++) {
        if (structure[i] && (structure[i]["is_tlm_add_menu"] || (structure[i].id && structure[i].id.endsWith("tlm_delete")))) {
            delete structure[i];
        }
    }
}