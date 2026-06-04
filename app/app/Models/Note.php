<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Checklist;
use App\Models\User;

class Note extends Model
{
    protected $fillable = ["content", "todo", "paranoid", "checklist_id"];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
