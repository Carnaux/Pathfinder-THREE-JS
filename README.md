# Pathfinder for Three.js

An easy pathfinder for Three.js using a navmesh!!!

### How to use:


Import via script tag (NPM package soon):
```
<script src="lib/pathFinder.js"></script>
```
Pass the navmesh geometry( just the geometry, not the mesh!):
```
 pathfinder = new PathFinder(mesh.geometry);
```
To find a path call:

```
 let path = pathfinder.calculatePathPoints( InitialPos, FinalPos);
```

InitialPos and FinalPos are Vector3.

It returns an array of objects as:

```
    {
        f: "number",
        v: "Vector3"
    }
```

Each element(object) of the array is refering to a point of the path.

## WARNING!!!

This do not result in a smooth path with large triangles in the navmesh YET.
