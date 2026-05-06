<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ["content", "todo", "paranoid", "checklist_id"];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }
}
