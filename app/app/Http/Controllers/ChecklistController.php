<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    public function index()
    {
        return Checklist::with("notes")->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => ["required", "string"],
            "paranoid" => ["required", "integer"]
        ]);

        $checklist = Checklist::create($validated);
        return response()->json($checklist, 201);
    }

    public function show(Checklist $checklist)
    {
        return $checklist->load("notes");
    }

    public function update(Request $request, Checklist $checklist)
    {
        $validated = $request->validate([
            "name" => ["sometimes", "required", "string"],
            "paranoid" => ["sometimes", "required", "integer"]
        ]);

        $checklist->update($validated);
        return response()->json($checklist, 200);
    }

    public function destroy(Checklist $checklist)
    {
        $checklist->delete();
        return response()->json(null, 204);
    }
}
