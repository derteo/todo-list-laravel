<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->checklists()
            ->with("notes")
            ->where("paranoid", 0)
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name"     => ["required", "string"],
            "paranoid" => ["required", "integer"],
        ]);

        $checklist = $request->user()->checklists()->create($validated);
        return response()->json($checklist, 201);
    }

    public function show(Request $request, Checklist $checklist)
    {
        $this->authorizeOwnership($request->user(), $checklist);
        return $checklist->load("notes");
    }

    public function update(Request $request, Checklist $checklist)
    {
        $this->authorizeOwnership($request->user(), $checklist);

        $validated = $request->validate([
            "name"     => ["sometimes", "required", "string"],
            "paranoid" => ["sometimes", "required", "integer"],
        ]);

        $checklist->update($validated);
        return response()->json($checklist, 200);
    }

    public function destroy(Request $request, Checklist $checklist)
    {
        $this->authorizeOwnership($request->user(), $checklist);
        $checklist->delete();
        return response()->json(null, 204);
    }

    private function authorizeOwnership($user, Checklist $checklist)
    {
        if ($user->id !== $checklist->user_id) abort(403);
    }
}