<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Note;

class Checklist extends Model
{
    protected $fillable = ["name", "paranoid"];

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
