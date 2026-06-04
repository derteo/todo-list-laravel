<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->notes()
            ->where("paranoid", 0)
            ->with("checklist")
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "content"      => ["required", "string"],
            "todo"         => ["required", "string"],
            "paranoid"     => ["required", "integer"],
            "checklist_id" => ["required", "integer"],
        ]);

        $note = $request->user()->notes()->create($validated);
        return response()->json($note->load("checklist"), 201);
    }

    public function show(Request $request, Note $note)
    {
        $this->authorizeOwnership($request->user(), $note);
        return $note;
    }

    public function update(Request $request, Note $note)
    {
        $this->authorizeOwnership($request->user(), $note);

        $validated = $request->validate([
            "content"      => ["sometimes", "required", "string"],
            "todo"         => ["sometimes", "required", "string"],
            "paranoid"     => ["sometimes", "required", "integer"],
            "checklist_id" => ["sometimes", "required", "integer"],
        ]);

        $note->update($validated);
        return response()->json($note->load("checklist"), 200);
    }

    public function destroy(Request $request, Note $note)
    {
        $this->authorizeOwnership($request->user(), $note);
        $note->delete();
        return response()->json(null, 204);
    }

    private function authorizeOwnership($user, Note $note)
    {
        if ($user->id !== $note->user_id) abort(403);
    }
}