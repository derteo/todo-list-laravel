<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index()
    {
        return Note::where("paranoid", 0)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "content" => ["required", "string"],
            "todo" => ["required", "string"],
            "paranoid" => ["required", "integer"],
            "checklist_id" => ["required", "integer"]
        ]);

        $note = Note::create($validated);
        return response()->json($note, 201);
    }

    public function show(Note $note)
    {
        return $note;
    }

    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            "content" => ["sometimes", "required", "string"],
            "todo" => ["sometimes", "required", "string"],
            "paranoid" => ["sometimes", "required", "integer"],
            "checklist_id" => ["sometimes", "required", "integer"]
        ]);

        $note->update($validated);
        return response()->json($note, 200);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json(null, 204);
    }
}
