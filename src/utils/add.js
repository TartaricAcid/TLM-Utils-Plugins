export function addTlmCube(group, start, size) {
    let baseCube = new Cube({
        autouv: (settings.autouv.value ? 1 : 0)
    }).init();
    baseCube.addTo(group);
    if (Format.bone_rig) {
        if (group) {
            let originPos = group.origin.slice();
            baseCube.extend({
                from: [start[0], start[1], start[2]],
                to: [start[0] + size[0], start[1] + size[1], start[2] + size[2]],
                origin: originPos.slice()
            });
        }
    }
}

export function addTlmGroup(group, pivot, rotation) {
    let baseGroup = new Group({
        origin: [pivot[0], pivot[1], pivot[2]],
        rotation: [rotation[0], rotation[1], rotation[2]]
    });
    baseGroup.addTo(group);
    if (Format.bone_rig) {
        baseGroup.createUniqueName();
    }
    baseGroup.init();
    return baseGroup;
}